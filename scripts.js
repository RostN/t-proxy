let temp = document.querySelector('#card'); //Шаблон карточки
const container =  document.querySelector('main');
const SHEET_ID = '1hxzvD5Gv_aDjR63iRx5Diw9EABdMufXBDFQVzyWWBVg';
const SHEET_NAME = 'proxy'; // Название листа

const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

async function fetchLinksFromSheet() {
    try {
        container.innerHTML = ''; //Очистка блока с картами
        const response = await fetch(url);
        const text = await response.text();
        
        // Google возвращает JSON внутри вызова функции, вырезаем только сам JSON
    const jsonString = text.substring(47).slice(0, -2);
    const json = JSON.parse(jsonString);
    
    const rows = json.table.rows;
    const result = [];
    
    rows.forEach((row) => {
        const card = temp.content.cloneNode(true); //Клонивание шаблока карточки
        const cardTitle = card.querySelector('#title'); // Заголовок
        const cardLink = card.querySelector('#link'); // Ссылка
      // row.c[0] — это колонка A, row.c[1] — колонка B
      // Оператор ?. защищает от ошибки, если ячейка A пока пустая
      const title = row.c[0]?.v || ''; 
      const link = row.c[1]?.v || '';
      // Превращает 'https://t.me...' в 'tg://proxy?server=...'
      const directTgLink = link.replace(/^https?:\/\/t\.me\//i, 'tg://');


      // Добавляем в список только те строки, где в колонке B есть ссылка
      if (link && String(link).startsWith('http')) {
        cardTitle.textContent = title;
        cardLink.href = directTgLink;
        result.push({
          title: String(title),
          link: String(link)
        });
      }
      container.appendChild(card);
    });

    console.log('Полученные данные:', result);
    return result;

  } catch (error) {
    console.error('Ошибка при загрузке таблицы:', error);
  }
}

fetchLinksFromSheet();
