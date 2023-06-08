import React, { useState, memo } from 'react';

import { Hero } from '../../types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIosTwoToneIcon from '@mui/icons-material/ArrowBackIosTwoTone';
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';

import styles from './PeopleList.module.css';

type PeopleListTypes = {
    data: Hero[] | null | undefined,
    next: () => void,
    previous: () => void,
    isLoading: boolean,
    error: boolean,
    hasNext: boolean,
    hasPrevious: boolean
    search: string | null,
    onItemClick: (event: React.MouseEvent<HTMLDivElement>) => void,
    onSearchChange: (str: string) => void,
}

export const PeopleList = memo(function ({ 
    data, 
    next, 
    previous, 
    isLoading, 
    error, 
    hasNext, 
    hasPrevious, 
    search, 
    onItemClick,
    onSearchChange
}: PeopleListTypes) {

    const [input, setInput] = useState<string | null>(search);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
        onSearchChange(event.target.value);
    }

    return (
        <div className={styles.PeopleList}>
            <TextField 
                id="outlined-basic" 
                label="Search" 
                variant="outlined" 
                value={input}
                onChange={onInputChange}
                size="small"
                fullWidth
                sx={{ marginBottom: "20px"}}
            />
            {
                isLoading || error || !data || data?.length === 0 ? (
                <div className={styles.PeopleList__EmptyContainer}>
                    {
                        isLoading ? <CircularProgress /> : error ? "Error" : "No data"
                    }
                </div>
                ) : (
                    <List sx={{
                        flexGrow: 1,
                        height: 0,
                        width: '100%',
                        position: 'relative',
                        overflow: 'auto',
                        '& ul': { padding: 0 },
                      }}>
                        {
                            data!.map((item, index) => {
                                return  (
                                    <ListItem key={item.name} disablePadding>
                                        <ListItemButton data-id={index} onClick={onItemClick} aria-label="select item">
                                            <ListItemText primary={item?.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                )
            }
            <div>
                <ButtonGroup
                    disableElevation
                    variant="contained"
                >
                    {
                        hasPrevious && (
                            <IconButton onClick={previous} aria-label="previous" color="primary">
                                <ArrowBackIosTwoToneIcon />
                            </IconButton>
                        )
                    }
                    {
                        hasNext && (
                            <IconButton onClick={next} aria-label="next" color="primary">
                                <ArrowForwardIosTwoToneIcon />
                            </IconButton>
                        )
                    }
                </ButtonGroup>
            </div>
        </div>
    )
})
