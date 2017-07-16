const S1 = new Seymour(microVizContainer1, null, true, false);

S1.editor.setValue(`var x = 2;
var y = 4;

x = 3;
y = 1;`);


const S2 = new Seymour(microVizContainer2, null, true, false);

  S2.editor.setValue(`var sum = 0;
for 1 to: 3 do: {x |
  sum = sum + x;
};`);


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


const S4 = new Seymour(microVizContainer4, null, true, false);

  S4.editor.setValue(`var b = 0;
def Number.f() {
  var c = 2;
  b = 1;
  b = 10;
}

5.f();`);


const S5 = new Seymour(microVizContainer5, null, true, false);

  S5.editor.setValue(`def Number.add() {
  return {y |
    y + this
  };
}

var add5 = 5.add();
var ans = add5(6);`);

let setFocus = true;
S5.addListener('done', (_, __) => {
  if (setFocus) {
    const programEvent = S5.interpreter.global.env.programOrSendEvent;
    const theEvent = programEvent.children[2];
    S5.highlighting.focusLexicalStack(theEvent);
    setFocus = false;
  }
});
