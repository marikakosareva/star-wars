import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

import { Hero } from '../../types';
import { fetchData } from '../../common/helpers';

import styles from './Person.module.css';

type PersonTypes = {
    data: Hero, 
    back: () => void,
    save: (item: Hero) => void,
}

export const Person = memo(function ({ data, back, save }: PersonTypes) {

    const [name, setName] = useState(data.name);

    const [height, setHeight] = useState(data.height);
    const [mass, setMass] = useState(data.mass);
    const [hairColor, setHairColor] = useState(data.hair_color);
    const [skinColor, setSkinColor] = useState(data.skin_color);
    const [eyeColor, setEyeColor] = useState(data.eye_color);
    const [birthYear, setBirthYear] = useState(data.birth_year);
    const [gender, setGender] = useState(data.gender);

    const [homeworld, setHomeworld] = useState<string[] | null>(null);
    const [films, setFilms] = useState<string[] | null>(null);
    const [species, setSpecies] = useState<string[] | null>(null);
    const [vehicles, setVehicles] = useState<string[] | null>(null);
    const [starships, setStarships] = useState<string[] | null>(null);

    const [isHomeworldPending, setHomeworldPending] = useState(false);
    const [isFilmsPending, setFilmsPending] = useState(false);
    const [isSpeciesPending, setSpeciesPending] = useState(false);
    const [isVehiclesPending, setVehiclesPending] = useState(false);
    const [isStarshipsPending, setStarshipsPending] = useState(false);

    const isPending = useMemo(() => {
        return Boolean(
            isHomeworldPending || 
            isFilmsPending || 
            isSpeciesPending || 
            isVehiclesPending || 
            isStarshipsPending
        );
    }, [isHomeworldPending, isFilmsPending, isSpeciesPending, isVehiclesPending, isStarshipsPending]);

    useEffect(() => {
        fetchData(data, setFilmsPending, setFilms, 'films', 'title');
        fetchData(data, setHomeworldPending, setHomeworld, 'homeworld', 'name');
        fetchData(data, setSpeciesPending, setSpecies, 'species', 'name');
        fetchData(data, setVehiclesPending, setVehicles, 'vehicles', 'name');
        fetchData(data, setStarshipsPending, setStarships, 'starships', 'name');
    }, [data]);

    const onSaveClick = useCallback(() => {
        const newData = { 
            ... data, 
            height: height, 
            mass: mass,
            hair_color: hairColor,
            skin_color: skinColor,
            eye_color: eyeColor,
            birth_year: birthYear,
            gender: gender, 
        };
        save(newData);
        back();
    }, [height, mass, hairColor, skinColor, eyeColor, birthYear, gender]);

    const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget.value;
        switch (event.currentTarget.id) {
            case 'height': setHeight(input);
            break;
            case 'mass': setMass(input);
            break;
            case 'hair_color': setHairColor(input);
            break;
            case 'skin_color': setSkinColor(input);
            break;
            case 'eye_color': setEyeColor(input);
            break;
            case 'birth_year': setBirthYear(input);
            break;
            case 'gender': setGender(input);
            break;
        }
    }, []);

    return (
        <div className={styles.Person}>
            <ButtonGroup
                disableElevation
                variant="contained"
            >
                <IconButton onClick={back} aria-label="back" color="primary">
                    <ArrowBackIcon />
                </IconButton>
            </ButtonGroup>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="name" label="Name" variant="standard" defaultValue={name} disabled onChange={onChange} />
                <TextField id="height" label="Height" variant="standard" defaultValue={height} onChange={onChange} />
                <TextField id="mass" label="Mass" variant="standard" defaultValue={mass} onChange={onChange} />
                <TextField id="hair_color" label="Hair color" variant="standard" defaultValue={hairColor} onChange={onChange} />
                <TextField id="skin_color" label="Skin color" variant="standard" defaultValue={skinColor} onChange={onChange} />
                <TextField id="eye_color" label="Eye color" variant="standard" defaultValue={eyeColor} onChange={onChange} />
                <TextField id="birth_year" label="Birth year" variant="standard" defaultValue={birthYear} onChange={onChange} />
                <TextField id="gender" label="Gender" variant="standard" defaultValue={gender} onChange={onChange} />
            </Box>  
            { homeworld && <p><b>Homeworld:</b> {homeworld.join(", ") || " - "}</p> } 
            { films && <p><b>Films:</b> {films.join(", ") || " - "}</p> } 
            { species && <p><b>Species:</b> {species.join(", ") || " - "}</p> } 
            { vehicles && <p><b>Vehicles:</b> {vehicles.join(", ") || " - "}</p> } 
            { starships && <p><b>Starships:</b> {starships.join(", ") || " - "}</p> } 
            { isPending && 
                <div className={styles.Person__Pending}>    
                    <CircularProgress />
                </div> 
            }
            <ButtonGroup
                disableElevation
                variant="contained"
            >
                <Button variant="contained" onClick={onSaveClick} aria-label="save" >
                    Save
                </Button>
            </ButtonGroup>
        </div>
    );
});