type CharacterType = {
  topPick: string;
};

export const SelectedCharacter = ({ topPick }: CharacterType) => {
  const characterPicture = () => {
    if (topPick === "Luffy") {
      return "static/images/Luffy.png";
    } else if (topPick === "Zoro") {
      return "static/images/Zoro.jpeg";
    } else if (topPick === "Sanji") {
      return "static/images/Sanji.png";
    } else if (topPick === "Nami") {
      return "static/images/Nami.jpg";
    } else if (topPick === "Usopp") {
      return "static/images/Usopp.png";
    } else if (topPick === "Chopper") {
      return "static/images/Chopper.jpeg";
    } else if (topPick === "Robin") {
      return "static/images/Robin.jpeg";
    } else if (topPick === "Franky") {
      return "static/images/Franky.jpeg";
    } else if (topPick === "Brook") {
      return "static/images/Brook.png";
    } else if (topPick === "Jinbe") {
      return "static/images/Jinbe.png";
    }
    return undefined;
  };
  return (
    <div className="items-center flex flex-col gap-4">
      <p className="text-3xl font-bold">{topPick}!</p>
      <img
        className="w-[800px]"
        src={characterPicture()}
        alt="Straw Hat image"
      />
    </div>
  );
};
