# jQuery Slider plugin

[Example page](https://kd-slider-plugin.netlify.app/example)

Slider with MVP architecture. Data transfer by Observer pattern.

UML diagram
![jQery slider plugin (1)](https://user-images.githubusercontent.com/54976219/148756009-6b2d532a-1a4d-4446-9add-04b0d9cd2b72.png)

### Main features
* Change step
* Vertical / horizontal view
* Single value / range
* Interface for change slider values
* Interactive scale of values
* Progress bar
* Value tip
* Toggle elements: tip, bar, scale 
* Work with touch devices
* Responsive
## API
### Usage Example
```js
   import $ from  'jquery';
   import './dist/slider';
   
   const sliderSettings  = {
      from: -5000,
      to: 2500,
      min: -5000,
      max: 5000,
      step: 5,
      showBar: true,
      showScale: true,
      showTip: true,
      isRange: true,
      isVertical: true,
      };

   const $slider = $(sliderContainer).createSlider(sliderSettings);

   // chaining
   $slider.setMin(-100).setMax(100);
```
### Settings
|name|type|info|
|--|--|--|
|min|number|required|
|max|number|required|
|from|number|required|
|to|number|--|
|step|number|above 0|
|showBar|boolean|--|
|showScale|boolean|--|
|showTip|boolean|--|
|isRange|boolean|--|
|isVertical|boolean|--|

### Methods
```js
fromChangedEvent(callback: () =>  void)
toChangedEvent(callback: () =>  void)
setFrom(from)
getFrom();
setTo(to)
getTo();
setStep(step)
getStep();
setMin(min)
getMin();
setMax(max)
getMax();
setShowTip(show)
getShowTip();
setShowScale(show)
getShowScale();
setShowBar(show)
getShowBar();
setIsRange(isRange)
getIsRange();
setIsVertical(isVertical)
getIsVertical();
```

## Use tips
Use  first
```bash
npm install
```
### Start
```bash
npm run start
```
### Production build
```bash
npm run build
```
### Run eslint auto fix
```bash
npm run lint:fix
```
### Run style lint auto fix
```bash
npm run stlint:fix
```

### Run tests
```bash
npm run test
```

### Get coverage
```bash
npm run test:coverage
```

## Dependencies
* node: 14.18.1
* jQuery: 3.6.0
