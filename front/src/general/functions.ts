
export const getData = async (value:any) => {
    try {
        const response = await fetch(value.url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify(value)
        });
        const data = await response.json();
        return data
    } catch (e) {
        console.error('Ошибка функции fetchTools: ', e)
    } finally {
        // console.log('Функция fetchTools() отработала...')
    }
};



