#### The Visual Arts

Anki like pic quiz.

Что делает приложение:
+ При каждом GET запросе к images-api рекурсивно ищет картинки в подпапках  директории img.
+ На клиент приходит json формата
``` javascript
[{"text":"author_name","href":"path_to_image"}]
```
+ Массив путей к картинкам перемешивается.
+ С помощью jquery показываем указанное кол-во картинок пользователю.

Технологии:
Node.js
Express
Jquery
