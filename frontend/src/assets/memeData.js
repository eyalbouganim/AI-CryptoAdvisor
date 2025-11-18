export const cryptoMemes = [
    // I need to remember to insert crypto memes here later
];

export const getRandomMeme = () => {
  const randomIndex = Math.floor(Math.random() * cryptoMemes.length);
  return cryptoMemes[randomIndex];
};