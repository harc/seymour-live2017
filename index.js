const S1 = new Seymour(microVizContainer1, null, true, false);

S1.editor.setValue(`var x = 2;
var y = 4;

x = 3;
y = 1;`);

S1.addListener('codeChanged', _ => clearError(1));
S1.addListener('error', e => displayError(1, e.toString()));


const S2 = new Seymour(microVizContainer2, null, true, false);

  S2.editor.setValue(`var sum = 0;
for 1 to: 3 do: {x |
  sum = sum + x;
};`);

S2.addListener('codeChanged', _ => clearError(2));
S2.addListener('error', e => displayError(2, e.toString()));


const S3 = new Seymour(microVizContainer3, null, true, false);

  S3.editor.setValue(`for 1 to: 15 do: {x |
  var ans = "";
  if x % 3 == 0 then: {
    ans = ans + "fizz";
  };
  if x % 5 == 0 then: {
    ans = ans + "buzz";
  };

  if ans == "" then: {
    ans = x.toString();
  };

  ans.show();
};`);

S3.addListener('codeChanged', _ => clearError(3));
S3.addListener('error', e => displayError(3, e.toString()));


const S4 = new Seymour(microVizContainer4, null, true, false);

  S4.editor.setValue(`var b = 0;
def Number.f() {
  var c = 2;
  b = 1;
  b = 10;
}

5.f();`);

S4.addListener('codeChanged', _ => clearError(4));
S4.addListener('error', e => displayError(4, e.toString()));


const S5 = new Seymour(microVizContainer5, null, true, false);

  S5.editor.setValue(`def Number.add() {
  return {y |
    y + this
  };
}

var add5 = 5.add();
var ans = add5(6);`);

S5.addListener('codeChanged', _ => clearError(5));
S5.addListener('error', e => displayError(5, e.toString()));

let setFocus = true;
S5.addListener('done', (_, __) => {
  if (setFocus) {
    const programEvent = S5.interpreter.global.env.programOrSendEvent;
    const theEvent = programEvent.children[2];
    S5.highlighting.focusLexicalStack(theEvent);
    setFocus = false;
  }
});


function clearError(n) {
  const errorDiv = document.getElementById('errorDiv' + n);
  errorDiv.innerHTML = '';
}

function displayError(n, message) {
  const errorDiv = document.getElementById('errorDiv' + n);
  errorDiv.innerHTML = '';
  errorDiv.innerText = message;
}