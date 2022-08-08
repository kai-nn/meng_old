import React, {memo} from 'react'
import DrawingStr from "./components/DrawingStr/DrawingStr";
import TechStr from "./components/TechStr/TechStr";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";

const List = ({detail=[], techno=[]}) => {

    return (
        <>
            {console.log('%c List render', 'color: yellow')}
            <DrawingStr key={'DrawingStr'} drawing={'Чертеж'} />
            <TechStr
                key={'TechStr'}
                name={'Обозначение технологии'}
                version={'№ изм.'}
                title={'Описание'}
                status={<FlagOutlinedIcon />}
                clickable={false} />

            {
                detail?.map((d, i) => (
                    <DrawingStr key={`d_str_${i}`} drawing={d.drawing}>
                        {
                            techno?.map((t, j) => {
                                return (
                                    t.detail_id === d.id ?
                                        <TechStr key={`t_str_${j}`}
                                                 name={t.name}
                                                 version={t.version}
                                                 title={t.description}
                                                 status={t.status_tech}
                                                 clickable={true}/> : ''
                                )
                            })
                        }
                    </DrawingStr>
                ))
            }
        </>
    )
}

export default memo(List)