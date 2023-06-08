import { Hero } from "../types";
import { getAllPeople } from "./endpoints"

export const getUrl = (page: number, search: string | null) => {
    if (search) {
        return `${getAllPeople}?page=${page}&search=${search}`;
    }
    return `${getAllPeople}?page=${page}`;
}

export const getData = (url: string) => {
    return fetch(url).then(response => {
        return response.json();
    })
}

export const fetchData = (
        data: Hero, 
        pending: (state: boolean) => void, 
        setData: (arr: string[]) => void, 
        resource: string, 
        prop: string
    ) => {
    const resourceData = data?.[resource as keyof Hero] ;
    if (resourceData) {
        pending(true);
        const urlArray = Array.isArray(resourceData) ? resourceData : [resourceData];
        Promise.all(urlArray.map(url => getData(url)))
        .then((results) => {
            setData(results.map(item => item[prop]));
        }).catch((e) => {
            console.log(e.message)
        })
        .finally(() => {
            pending(false);
        })
    }
    
}