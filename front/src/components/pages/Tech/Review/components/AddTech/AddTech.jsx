import React, {useState} from "react";
import Modal from "../../../../../Modal/Modal";
import './AddTech.module.scss'
import Button from "@mui/material/Button";
import {Add} from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import TextField from "@mui/material/TextField";

const AddTech = ({addTech, setAddTech}) => {

  const [expanded, setExpanded] = useState(true);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  };


  const extendStyle = {
      border: "1px solid lightgrey",
      boxShadow: "none",
      borderRadius: "4px"
  }

    return (
        <Modal
            active={addTech}
            setActive={setAddTech}
            header={
                <Typography variant="h6" gutterBottom component="div" color="primary">
                    Добавление технологии
                </Typography>}
            footer={
                <>
                    <Button color="success"><Add />Создать</Button>
                    <Button color="secondary"><ContentCopyIcon />Копировать</Button>
                    <Button color="error"><DeleteOutlineIcon />Удалить</Button>
                    <Button color="primary"><ArchiveOutlinedIcon />В архив</Button>
                </>
                }
            >

            <Accordion
                expanded={expanded}
                onChange={handleChange('panel1')}
                sx={{...extendStyle}}
                >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <b>Основные характеристики</b>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={'field'} style={{display: "grid", gridTemplateColumns: "auto auto", gap: "10px"}}>
                        <TextField
                          label="Деталь"
                          size="small"
                          defaultValue="value"
                        />
                        <TextField
                          label="Название"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="Обозначение технологии"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="Индекс"
                          size="small"
                          defaultValue=""
                        />
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{...extendStyle}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                   <b>Атрибуты документа</b>
                </AccordionSummary>
                <AccordionDetails>
                    <div className={'field'} style={{display: "grid", gridTemplateColumns: "80% auto",  gap: "10px"}}>
                        <TextField
                          label="Название комлекта"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="Литера"
                          size="small"
                          defaultValue=""
                        />
                    </div>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{...extendStyle}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                    <b>Заготовка</b>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                      label="Сортамент"
                      size="small"
                      // multiline
                      style={{width: "100%", margin: "0 0 10px 0"}}
                      defaultValue=""
                    />
                    <div className={'field'} style={{display: "grid", gridTemplateColumns: "auto auto", gap: "10px"}}>
                        <TextField
                          label="Код"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="ЕВ"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="МД"
                          size="small"
                          defaultValue=""
                        />
                        <TextField
                          label="ЕН"
                          size="small"
                          defaultValue=""
                        />
                    </div>
                </AccordionDetails>
            </Accordion>

        </Modal>

    )
}

export default AddTech