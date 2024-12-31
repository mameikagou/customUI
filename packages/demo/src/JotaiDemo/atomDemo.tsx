import React from 'react';
import { atom, useAtom } from "@customui/jotai";

const AtomDemo = () => {
  const animeAtom = atom([
    {
      title: "Ghost in the Shell",
      year: 1995,
      watched: true,
    },
    {
      title: "Serial Experiments Lain",
      year: 1998,
      watched: false,
    },
  ]);
  const [anime, setAnime] = useAtom(animeAtom);
  const title = atom("1");
  const [titleValue, setTitle] = useAtom(title);
  return (
    <>
      <ul>
        {anime.map((item) => <li key={item.title}>{item.title}</li>)}
      </ul>
      <input value={titleValue} onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          setAnime((anime: any) => [
            ...anime,
            {
              title: titleValue,
              year: 1998,
              watched: false,
            },
          ]);
        }}
      >
        Add Cowboy Bebop
      </button>
    </>
  );
};

export default AtomDemo;
