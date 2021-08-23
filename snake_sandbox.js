// src='//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML'>

// for typesetting mathjax
// let math_promise = Promise.resolve(); // Used to hold chain of typesetting
// calls

/* Utilities */
function round(value, precision = 1) {
  var multiplier = Math.pow(10, precision || 0);
  return (Math.round(value * multiplier) / multiplier).toFixed(precision);
}

function transform(slider_value) {
  // range from 1--100, so we multiply by 0.1 to get the actual value
  return parseInt(slider_value) == 0 ? 0.1 : (parseFloat(slider_value)) * 0.1;
}

function typeset(code) {
  MathJax.startup.promise =
      MathJax.startup.promise.then(() => MathJax.typesetPromise(code()))
          .catch((err) => console.log('Typeset failed: ' + err.message));
  return MathJax.startup.promise;
}

function typeset_curvature() {
  switch (curvatureSelection.value) {
  case 'sin':
    return '\\( \\epsilon \\cos\\left( 2\\pi k (s + t)\\right) \\)';
  case 'test':
    return '\\( \\alpha = 2 \\)';
  }
}

/* Display of curvature */
const curvatureParamIDs = [ 'sinParams', 'testParams' ];

async function hideCurvatureParams() {
  curvatureParamIDs.forEach(
      elementID => { document.getElementById(elementID).className = 'hide'; });
}

async function showCurvatureActivation() {
  await typeset(() => {
    // console.log(typeset_curvature());
    curvatureActivationReadout.innerHTML = typeset_curvature();
    return [ curvatureActivationReadout ];
  });
  // curvatureActivationReadout.innerHTML = typeset_curvature();
}

async function showCurvatureParameters() {
  hideCurvatureParams();
  const elementID = (() => {
    switch (curvatureSelection.value) {
    case 'sin':
      return curvatureParamIDs[0];
    case 'test':
      return curvatureParamIDs[1];
    }
  })();
  // console.log(elementID);
  document.getElementById(elementID).className = 'vis';
}

async function showCurvatureInfo() {
  showCurvatureActivation();
  showCurvatureParameters();
}

/* Display of lift */
const liftParamIDs = [ 'liftSinParams', 'liftTestParams' ];

async function hideLiftParams() {
  liftParamIDs.forEach(
      elementID => { document.getElementById(elementID).className = 'hide'; });
}

async function showLiftActivation() {
  await typeset(() => {
    // console.log(typeset_curvature());
    liftActivationReadout.innerHTML = typeset_curvature();
    return [ liftActivationReadout ];
  });
  // curvatureActivationReadout.innerHTML = typeset_curvature();
}

async function showLiftParameters() {
  hideLiftParams();
  const elementID = (() => {
    switch (liftSelection.value) {
    case 'sin':
      return liftParamIDs[0];
    case 'test':
      return liftParamIDs[1];
    }
  })();
  // console.log(elementID);
  document.getElementById(elementID).className = 'vis';
}

async function showLiftInfo() {
  showLiftActivation();
  showLiftParameters();
}

function froudeNumber() { return round(transform(froudeNumberSlider.value)); }
function showFroudeNumber() { froudeNumberReadout.innerHTML = froudeNumber(); }

function lateralFriction() {
  return round(transform(lateralFrictionSlider.value));
}
function showLateralFriction() {
  lateralFrictionReadout.innerHTML = lateralFriction();
}

function backwardFriction() {
  return round(transform(backwardFrictionSlider.value))
}
function showBackwardFriction() {
  backwardFrictionReadout.innerHTML = backwardFriction();
}

function sinAmplitude() { return round(transform(sinAmplitudeSlider.value)); }
function showSinAmplitude() { sinAmplitudeReadout.innerHTML = sinAmplitude(); }

function sinWaveNumber() { return parseInt(sinWaveNumberSlider.value); }
function showSinWaveNumber() {
  sinWaveNumberReadout.innerHTML = sinWaveNumber();
}

function liftSinAmplitude() {
  return round(transform(liftSinAmplitudeSlider.value));
}
function showLiftSinAmplitude() {
  liftSinAmplitudeReadout.innerHTML = liftSinAmplitude();
}

function liftSinWaveNumber() { return parseInt(liftSinWaveNumberSlider.value); }
function showLiftSinWaveNumber() {
  liftSinWaveNumberReadout.innerHTML = liftSinWaveNumber();
}

function liftSinPhase() {
  return round(parseFloat(liftSinPhaseSlider.value) * 0.01);
}
function showLiftSinPhase() { liftSinPhaseReadout.innerHTML = liftSinPhase(); }

// selections
const curvatureSelection = document.querySelector("#curvatureSelection");
const liftSelection = document.querySelector("#liftSelection");

// sliders
const froudeNumberSlider = document.querySelector("#froudeNumberSlider");
const lateralFrictionSlider = document.querySelector("#lateralFrictionSlider");
const backwardFrictionSlider =
    document.querySelector("#backwardFrictionSlider");
const sinAmplitudeSlider = document.querySelector("#sinAmplitudeSlider");
const sinWaveNumberSlider = document.querySelector("#sinWaveNumberSlider");
const liftSinAmplitudeSlider =
    document.querySelector("#liftSinAmplitudeSlider");
const liftSinWaveNumberSlider =
    document.querySelector("#liftSinWaveNumberSlider");
const liftSinPhaseSlider = document.querySelector("#liftSinPhaseSlider");

// readouts for selections
const curvatureActivationReadout =
    document.querySelector("#curvatureActivationReadout");
const liftActivationReadout = document.querySelector("#liftActivationReadout");

// readouts for sliders
const froudeNumberReadout = document.querySelector("#froudeNumberReadout");
const lateralFrictionReadout =
    document.querySelector("#lateralFrictionReadout");
const backwardFrictionReadout =
    document.querySelector("#backwardFrictionReadout");
const sinAmplitudeReadout = document.querySelector("#sinAmplitudeReadout");
const sinWaveNumberReadout = document.querySelector("#sinWaveNumberReadout");
const liftSinAmplitudeReadout =
    document.querySelector("#liftSinAmplitudeReadout");
const liftSinWaveNumberReadout =
    document.querySelector("#liftSinWaveNumberReadout");
const liftSinPhaseReadout = document.querySelector("#liftSinPhaseReadout");

function addListeners() {

  function reset_and_(...fns) {
    // return a closure
    return () => {
      fns.forEach(fn => fn());
      // restartSimulator();
    }
  };

  const slider_pairs = [
    [ froudeNumberSlider, reset_and_(showFroudeNumber) ],
    [ lateralFrictionSlider, reset_and_(showLateralFriction) ],
    [ backwardFrictionSlider, reset_and_(showBackwardFriction) ],
    [ sinAmplitudeSlider, reset_and_(showSinAmplitude) ],
    [ sinWaveNumberSlider, reset_and_(showSinWaveNumber) ],
    [ liftSinAmplitudeSlider, reset_and_(showLiftSinAmplitude) ],
    [ liftSinWaveNumberSlider, reset_and_(showLiftSinWaveNumber) ],
    [ liftSinPhaseSlider, reset_and_(showLiftSinPhase) ]
  ]
  slider_pairs.forEach((p) => {
    p[0].addEventListener("input", p[1]);
    p[0].addEventListener("change", p[1]);
  });

  const selection_pairs = [
    [ curvatureSelection, reset_and_(showCurvatureInfo) ],
    [ liftSelection, reset_and_(showLiftInfo) ]
  ];
  selection_pairs.forEach((p) => { p[0].addEventListener("change", p[1]); });
}

function showParameterInfo() {
  showCurvatureInfo();
  showLiftInfo();

  // physical parameters
  showFroudeNumber();
  showLateralFriction();
  showBackwardFriction();

  // curvature
  showSinAmplitude();
  showSinWaveNumber();

  // lift
  showLiftSinAmplitude();
  showLiftSinWaveNumber();
  showLiftSinPhase();
}

// placeholder plot
// placeholderPlot();
addListeners();

// display at first go
showParameterInfo();
