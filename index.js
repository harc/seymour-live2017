const $$ = (query) => Array.prototype.slice.call(document.querySelectorAll(query));
const q = (query) => document.querySelector(query);

// INTERACTIVITY

const idToCode = {
  video1: `var sum = 0;\n\n`,
  video2: `var low = 0;
var high = 5;

var avg = (low + high)/2;\n\n`,
  video4: `var sum = 0;

for 1 to: 5 do: {x|
  sum = sum + x;
};\n`,
  video5: `var sum = 0;

for 1 to: 5 do: {x|
  if x % 2 != 0 then: {
    sum = sum + x;
  };
};\n`,
  reduce: `def Array.reduce2(fn, acc, idx) {
  var x = this.get(idx);
  acc = fn(acc, x);
  if idx == this.size() then: {
    return acc;
  } else: {
    return this.reduce2(fn, acc, idx + 1);
  };
}

var arr = [1, 2, 3, 4];
var sum = arr.reduce2({
  a,
  b |
  a + b
}, 0, 1);\n`,
  summary: `var a = 5;
var f = {
  a = a + 1;
  5
};

a = a + 1;
var b = f();
a = a - 1;\n`,
  'summary-2': `var a = 5;
var f = {
  a = 5;
  a = 6;
  var b = 7;
};

f();\n`,
  adder: `def Number.adder() {
  return {that |
    this + that
  };
}

var add5 = 5.adder();
var ans = add5(6);\n`,
  screenshot_fib_1: `def Number.fib() {
  if this < 2 then: {
    return this;
  } else: {
    var fa = (this-1).fib();
    var fb = (this-2).fib();
    return fa + fb;
  };
}

for 1 to: 7 do: {x|
  var fx = x.fib();
};\n`,
  fib_highlighting: `def Number.fibonacci() {
  if this < 2 then: {
    return this;
  } else: {
    var fa = (this-1).fibonacci();
    var fb = (this-2).fibonacci();
    return fa + fb;
  };
}

for 1 to: 7 do: {x|
  var fx = x.fibonacci();
};\n`,
  fib_focus: `def Number.fibonacci() {
  if this < 2 then: {
    return this;
  } else: {
    var fa = (this-1).fibonacci();
    var fb = (this-2).fibonacci();
    return fa + fb;
  };
}

for 1 to: 7 do: {x|
  var fx = x.fibonacci();
};\n`,
  video_fib: `def Number.fibonacci() {
  if this < 2 then: {
    return this;
  } else: {
    var fa = (this-1).fibonacci();
    var fb = (this-2).fibonacci();
    return fa + fb;
  };
}

for 1 to: 7 do: {x|
  var fx = x.fibonacci();
};\n`,
  video_arr_toString: `def Array.toString2() {
  var ans = "";
  forEach this do: {x, idx|
    var sx = x.toString();
    if idx != 1 then: {
      ans = ans + ",";
    };
    ans = ans + sx;
  };
  return "[" + ans + "]";
}

var a = [6, 1, 7].toString2();
var b = [false, true].toString2();\n`,
};

const idToSeymour = {};
const idToInitialHTML = {};

function swapInteractive(id) {
  let container = q(`figure#${id}`);
  if (container.classList.contains('scroll')) {
    container = container.querySelector('.contents');
  }
  const isInteractive = container.hasAttribute('isInteractive');

  const interactiveContainer = container.querySelector('.interactive');
  const figure = container.querySelector('.figure');
  const interactiveControls = container.querySelector('.controls .interactive');
  const figureControls = container.querySelector('.controls .figure');

  if (!isInteractive) {
    const microVizContainer =  interactiveContainer.querySelector('.microVizContainer');
    const errorDiv = interactiveContainer.querySelector('.errorDiv');
    let macroVizContainer = interactiveContainer.querySelector('.macroVizContainer');

    const code = idToCode[id];
    idToInitialHTML[id] = interactiveContainer.innerHTML;
    const S = new Seymour(microVizContainer, macroVizContainer, true, true);
    S.editor.setValue(code);
    idToSeymour[id] = S;

    function displayError(message) {
      errorDiv.innerHTML = '';
      errorDiv.innerText = message;
    }
    S.addListener('error', e => displayError(e.toString()));

  }

  if (isInteractive) {
    figure.style.display = 'block';
    figureControls.style.display = 'inline';

    interactiveContainer.style.display = 'none';
    interactiveControls.style.display = 'none';

    container.removeAttribute('isInteractive');
    interactiveContainer.innerHTML = idToInitialHTML[id];
  } else {
    interactiveContainer.style.display = 'block';
    interactiveControls.style.display = 'inline';

    figure.style.display = 'none';
    figureControls.style.display = 'none';

    container.setAttribute('isInteractive', true);
  }
}

// TODO: make reset a hard reset that interrupts things/deletes seymour?
function reset(id) {
  idToSeymour[id].editor.setValue(idToCode[id]);
}


// TIMESTAMPS

let currentEndTime = null;
let seekListeners = [];

const  timestamps = Array.from(document.querySelectorAll('a.timestamp'));
timestamps.forEach(timestamp => {
  const startSeconds = parseSeconds(timestamp.getAttribute('start'));
  const endSeconds = parseSeconds(timestamp.getAttribute('end'));
  const video = document.querySelector(`#${timestamp.getAttribute('videoId')} video`);
  timestamp.addEventListener('click', e => {
    video.currentTime = startSeconds;
    currentEndTime = endSeconds;

    const timeListener = () => {
      if(currentEndTime !== null && video.currentTime >= currentEndTime) {
        video.pause();
        video.removeEventListener('timeupdate', timeListener);
      } 
    };

    let count = 0;
    const seekListener = () => {
      if (count > 0) {
        count = 0;
        currentEndTime = null;
        video.removeEventListener('seeking', seekListener);
      } else {
        count++;
      }
    }
    video.addEventListener('timeupdate', timeListener);
    seekListeners.forEach(l => video.removeEventListener('seeking', l));
    seekListeners = [];
    seekListeners.push(seekListener);
    video.addEventListener('seeking', seekListener);
    if (video.paused && !video.ended) {
      video.play();
    }
    e.preventDefault();
  });
});

function parseSeconds(str) {
  const minuteAndSeconds = str.split(':');
  const minute = parseInt(minuteAndSeconds[0]);
  const seconds = parseInt(minuteAndSeconds[1]);
  return 60 * minute + seconds;
}

const videos = Array.from(document.querySelectorAll('video'));
videos.forEach(video => {
  const toggleControls = () => {
    if (video.hasAttribute("controls")) {
      video.removeAttribute("controls")   
    } else {
      video.setAttribute("controls","controls")   
    }
  }

  const togglePlaying = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
  video.addEventListener('mouseover', toggleControls);
  video.addEventListener('mouseout', toggleControls);
  video.addEventListener('click', togglePlaying);
})

// MAKE EXAMPLES STICK TO THE TOP ON SCROLL

const fibExample = {
  contents: document.querySelector('#video_fib .contents'),
  wrapper: document.querySelector('#video_fib .scroll-wrapper'),
  end: document.querySelector('#arr_toString')
};

const toStringExample = {
  contents: document.querySelector('#video_arr_toString .contents'),
  wrapper: document.querySelector('#video_arr_toString .scroll-wrapper'),
  end: document.querySelector('#related-work')
};

const examples = [fibExample, toStringExample];

function relocateAll() {
  examples.forEach(example => sticky_relocate(example));  
}

function sticky_relocate(example) {
  let windowTop = $(window).scrollTop();
  let divTop = $(example.wrapper).offset().top;

  let divBottom = $(example.wrapper).outerHeight() + 20;
  let bottom = $(example.end).offset().top - windowTop;

  if (windowTop > divTop && bottom > divBottom) {
    $(example.contents).addClass('stick');
    $(example.contents).css({top: `calc(${Math.floor(windowTop - divTop)}px + 1rem)`});
    $(example.wrapper).height($(example.contents).outerHeight());
  } else if (windowTop < divTop) {
    $(example.contents).removeClass('stick');
    $(example.contents).css({top: 'initial'});
    $(example.wrapper).height('initial');
  }
}

$(function() {
  examples.forEach(example => {
    $(window).scroll(relocateAll);
    relocateAll();
  })
})