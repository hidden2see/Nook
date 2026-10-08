const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[\]^_`{|}~";

const password_output = document.getElementById("password-field");
const length = document.getElementById("length-chooser");
const length_display = document.getElementById("password-length");
const lowercase = document.getElementById("lowercase");
const uppercase = document.getElementById("uppercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const look_alikes = document.getElementById("look-alikes");
const strength_bar = document.getElementById("strength-bar");
const strength_display = document.getElementById("strength-info");
const bits_display = document.getElementById("strength-bits");
const copy_button = document.getElementById("button-copy");
const new_button = document.getElementById("button-new");

function randomChar() {
  let item = Math.floor(Math.random() * 94);
  let character = characters.charAt(item);

  return character;
}

function strengthBar(bitse) {
  let colorp = (bitse / 128) * 100;
  switch (true) {
    case bitse <= 50:
      strength_bar.style.width = String(colorp) + "%";
      strength_bar.style.background = "var(--weak-password-bar)";
      strength_display.textContent = "Weak";
      strength_display.style.color = "var(--weak-password-bar)";

      break;
    case bitse <= 70:
      strength_bar.style.width = String(colorp) + "%";
      strength_bar.style.background = "var(--fair-password-bar)";
      strength_display.textContent = "Fair";
      strength_display.style.color = "var(--fair-password-bar)";
      break;
    case bitse <= 100:
      strength_bar.style.width = String(colorp) + "%";
      strength_bar.style.background = "var(--strong-password-bar)";
      strength_display.textContent = "Strong";
      strength_display.style.color = "var(--strong-password-bar)";

      break;
    default:
      strength_bar.style.width = String(colorp) + "%";
      strength_bar.style.background = "var(--vstrong-password-bar)";
      strength_display.textContent = "Very Strong";
      strength_display.style.color = "var(--vstrong-password-bar)";

      break;
  }
}

function generateNewPassword() {
  let password_generated = " ";
  let char;
  let potential_characters;
  let length_value = length.value;
  let lowercase_value = lowercase.checked;
  let uppercase_value = uppercase.checked;
  let numbers_value = numbers.checked;
  let symbols_value = symbols.checked;
  let look_alikes_value = look_alikes.checked;

  copy_button.querySelector("span").textContent = "Copy password"
  if (
    lowercase_value == false &&
    uppercase_value == false &&
    numbers_value == false &&
    symbols_value == false
  ) {
    password_output.textContent = "Please select at least one checkbox";
    return;
  }

  for (i = 1; i <= length_value; i++) {
    char = randomChar();

    switch (true) {
      case lowercase_value == false && /[a-z]/.test(char):
        i--;
        break;
      case uppercase_value == false && /[A-Z]/.test(char):
        i--;
        break;
      case numbers_value == false && /[0-9]/.test(char):
        i--;
        break;
      case symbols_value == false &&
        "!#$%&()*+,-./:;<=>?@[\]^_`{|}~".includes(char):
        i--;
        break;
      case look_alikes_value == true && "lIO0".includes(char):
        i--;
        break;
      default:
        password_generated += char;
        break;
    }
  }

  potential_characters = 0;
  if (lowercase_value) potential_characters += 26 - (look_alikes_value ? 1 : 0);
  if (uppercase_value) potential_characters += 26 - (look_alikes_value ? 2 : 0);
  if (numbers_value) potential_characters += 10 - (look_alikes_value ? 1 : 0);
  if (symbols_value) potential_characters += 23;
  console.log(potential_characters + " " + length_value);

  bitse = Math.round(length_value * Math.log2(potential_characters));
  strengthBar(bitse);
  bits_display.textContent = String(bitse) + " bits of entropy";

  password_output.textContent = password_generated;
}

length.addEventListener("input", function () {
  length_display.textContent = length.value;
  generateNewPassword();

  const pct = ((length.value - length.min) / (length.max - length.min)) * 100;
  length.style.setProperty("--fill", pct + "%");
});

generateNewPassword();
lowercase.addEventListener("change", generateNewPassword);
uppercase.addEventListener("change", generateNewPassword);
numbers.addEventListener("change", generateNewPassword);
symbols.addEventListener("change", generateNewPassword);
look_alikes.addEventListener("change", generateNewPassword);
new_button.addEventListener("click", generateNewPassword);
copy_button.addEventListener("click", function () {
  navigator.clipboard.writeText(password_output.textContent);
  copy_button.querySelector("span").textContent = "Copied!";
});