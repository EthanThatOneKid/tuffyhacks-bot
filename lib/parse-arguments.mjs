const parseArguments = (content) => {
  const args = content.split(" ").slice(1);
  return args;
};

export default parseArguments;
