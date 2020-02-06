# Github-like Gulp Boilerplate
A Gulp boilerplate that supports Nunjucks, SCSS, modern JS, SVG sprites.

## Get started

1. Install gulp globally

```
npm install gulp -g 
```

2. Install packages

```
npm install
```

3. Watch files for development
```
gulp
```
or 
```
npm run start
```
_Edit files in `src` folder, see result in `dist` folder_

4. Build for production

```
gulp build
```
or
```
npm run build
```
_This will **copy** files from folder `dist` => `public` and optimize them. So make sure it's called after watching._

## How to use inline SVG

1. Add `.svg` file to the `img` folder
2. Syntax in `.html`:
```
//index.html

<svg class="example-class-name">
  <use xlink:href="img/sprite.svg#example-file-name"></use>
 </svg>
```

* Make sure `example-file-name` matches your added `.svg` file name.
* `example-class-name` is used to style your svg, for instance:

```
//style.css

.example-class-name {
  width: 16px;
  height: 16px;
}
```
