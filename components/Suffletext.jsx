/*
1. Die Komponente auf der Startseite einsetzen.
2. Verbindet das Input-Element mit einem state "text"
3. Wenn der Text sich ändert, soll der Inhalt des
Input-Elements an unsere shuffletext-Schnittstelle gesendet
werden, der Antwort-Text soll in einem strong-Element
mit der Klasse .big-text angezeigt werden. Nutzt dafür
den state "shuffledText"
4. Bonus: Nutzt den Hook useDebouncedValue
*/

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useEffect, useState } from 'react';

export default function ShuffleText() {
  const [text, setText] = useState('');
  const [output, SetOutput] = useState('');

  const debouncedText = useDebouncedValue(text, 600);

  useEffect(() => {
    if (debouncedText.length > 2) {
      fetch(`/api/shuffletext?text=${debouncedText}`)
        .then((response) => response.json())
        .then((data) => SetOutput(data.suffledText))
        .catch((error) => console.log({ error }));
    }
  }, [debouncedText]);

  return (
    <div>
      <label htmlFor="text">Text</label>
      <br />
      <input
        type="text"
        id="text"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <strong className="big-text">
        {[...output].map((char) => (
          <span
            key={Math.random()}
            style={{
              '--delay': `${(Math.random() * 1).toFixed(2)}s`,
            }}
          >
            {char}
          </span>
        ))}
      </strong>
    </div>
  );
}
