export const cryptoMemes = [
  "https://i.imgflip.com/572k1f.jpg", 
  "https://i.kym-cdn.com/photos/images/newsfeed/002/297/467/73d.jpg",
  "https://i.imgflip.com/5b36m6.jpg", 
];

export const getRandomMeme = () => {
  const randomIndex = Math.floor(Math.random() * cryptoMemes.length);
  return cryptoMemes[randomIndex];
};