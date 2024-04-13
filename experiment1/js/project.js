const fillers = {
  compliment: ["you slayed", "you ate", "whats 4 + 4?", "can we date", "i wanna marry u", "love the fit", "served", "you are ethreal", "actually glowing"],
  nickname: ["girl", "GIRL", "BITCH", "bitch", "hoe", "HOE", "wifey", "bae", "babe"],
  emoji: ["❤️‍", "🥰","😍","🤩","😘","😜","😋","😝","💕","💞","💯","🙈",".😏","💝","🧡","💛","💚","💙","💜","🤎","🖤","👌","👅"],
};

const template = `$nickname $compliment $emoji
`;


// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
