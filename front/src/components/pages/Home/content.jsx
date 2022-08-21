import React from "react";
import image_1 from './images/IMG_2528_mini.PNG'
import image_2 from './images/IMG_2539_mini.PNG'
import image_3 from './images/IMG_2538_mini.PNG'


export const content = [
    {
        elementMenu: 'О сервисе',
        body:
            <div style={{textAlign: 'justify'}}>
                <h3>О сервисе</h3>

                <section>
                    <img src={image_1} width={'200px'} style={{float: 'left', margin: '0 20px 10px 0'}} alt="Картинка 1"/>
                    <p>
                    Для повышения продуктивности бизнеса многие производственные организации идут по пути автоматизации своих процессов.
                    Чаще всего начинают с бухгалтерии, складов, далее производство и т.д.
                    Как правило автоматизация инженерной деятельности долгое время замирает на внедрении CAD, CAM систем, и еще реже внедряют CAPP.
                    Безспорные лидеры всем известны и их решения в каждой нише способны удовлетворить любые потребности.
                    Но все ли так хороше, как представлено в красивых буклетах или на презентациях PR-специалистов?
                    </p>
                </section>


                <section>
                    <img src={image_2} height={'200px'} style={{float: 'right', margin: '0 0px 0px 20px'}} alt="Картинка 2"/>
                    Конечно, если
                    <ul>
                        <li>вы большая организация и единовременные вложение нескольких миллионов, а так же дороговизна сервисной поддержки не является проблеммой,</li>
                        <li>вас не пугают сроки развертывания корпоративных решений,</li>
                        <li>вы имеете достаточный штат высокооплачиваемых IT-специалистов или готовы время-от-времени их привлекать из вне</li>
                    </ul>
                </section>


                <section>
                    <img src={image_3} height={'200px'} style={{float: 'left', margin: '0 20px 0px 0'}} alt="Картинка 3"/>
                    Но если
                    <ul>
                        <li>вы умеете считать свои деньги, и готовы платить только за подписку своих пользователей,</li>
                        <li>вы рассматриваете возможность удаленного формата работы ваших сотрудников и желаете экономить на офисе,</li>
                        <li>вы не хотите тратить деньги на закупку дополнительной техники для доступа к инженерным данным в производстве,</li>
                    </ul>
                </section>

                <section style={{textAlign: 'center', fontWeight : 'bold'}}>то Вам стоит попробовать <span style={{color: 'orange'}}>micro</span><span style={{color: 'midnightblue'}}><b>erp</b></span>&nbsp; ! </section>

            </div>
    },



    {
        elementMenu: 'Демонстрация',
        body:
            <div style={{textAlign: 'justify'}}>
                <h3>Демонстрация</h3>
            </div>
    },



    {
        elementMenu: 'Отзывы пользователей',
        body:
            <div style={{textAlign: 'justify'}}>
                <h3>Отзывы пользователей</h3>
            </div>
    },



    {
        elementMenu: 'Как подключиться',
        body:
            <div style={{textAlign: 'justify'}}>
                <h3>Как подключиться</h3>
            </div>
    },



    {
        elementMenu: 'Об авторе',
        body:
            <div style={{textAlign: 'justify'}}>
                <h3>Об авторе</h3>
            </div>
    },
]