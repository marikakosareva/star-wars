import React, { useState, useEffect, useCallback } from 'react';
import styles from './Main.module.css';
import debounce from 'lodash.debounce';

import type { Hero, GetAllPeopleResponse } from '../../types/index';

import { getUrl } from '../../common/helpers';
import { Person } from '../Person';
import { PeopleList } from '../PeopleList';

export const Main = () => {

    const [data, setData] = useState<Hero[]>();
    const [hero, setHero] = useState<Hero | null>(null);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);

    const back = useCallback(() => {
        setHero(null);
    }, []);

    const next = useCallback(() => {
        if (hasNext) setPage(page + 1);
    }, [hasNext, page]);

    const previous = useCallback(() => {
        if (hasPrevious) setPage(page - 1);
    }, [hasPrevious, page]);

    const onItemClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const id = Number(event.currentTarget.dataset.id);
        if ( !isNaN(id) && data?.[id]) {
            setHero(data[id]);
        }
    };

    const onSearchChange = useCallback(debounce((input: string) => {
        setSearch(input);
        setPage(1);
    }, 500), []);

    const save = useCallback((hero: Hero) => {
        if (data) {
            const newData = [...data];
            const index = newData.findIndex(item => item.name === hero.name)
            newData.splice(index, 1, hero);
            setData(newData);
        }
    }, [data]);

    useEffect(() => {
        setIsLoading(true);
        fetch(getUrl(page, search))
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw Error();
        })
        .then((data: GetAllPeopleResponse) => {
            if (data) {
                setData(data?.results || []);
                setHasNext(Boolean(data?.next));
                setHasPrevious(Boolean(data?.previous));
                setError(false);
                return;
            }
            throw Error();
        })
        .catch((e) => {
            setError(true);
            console.log(e.message)
        })
        .finally(() => {
            setIsLoading(false);
        })
    }, [page, search]);

    return (
        <main className={styles.Main}>
            {
                hero ? (
                    <Person data={hero} back={back} save={save} />
                ) : (
                    <PeopleList 
                        data={data}
                        next={next}
                        previous={previous}
                        isLoading={isLoading}
                        error={error}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                        search={search}
                        onItemClick={onItemClick}
                        onSearchChange={onSearchChange}
                    />
                )
            }
        </main>
    );
} 