module.exports = {
  onError: (response, error) => {
    console.log(error);
    response.send(JSON.stringify(`There was an error with your request: ${error}`));
  }
};
