const wait = time => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

// handlePromise
async function hp(promise) {
  try {
    const res = await promise;
    // console.debug("res: received", res);
    return [null, res];
  } catch (err) {
    return [err];
  }
}

// handleFetch
async function hf(promise) {
  try {
    const res = await promise;
    // console.debug("hpJson: resolved", res);
    let json = (json = await res.json());
    // console.debug("hpJson: jsonParsed", json);
    return [null, json];
  } catch (err) {
    return [err];
  }
}

// setStateAsync
function setStateAsync(myObjOrFn) {
  return new Promise(resolve =>
    this.setState(myObjOrFn, () => {
      console.log("done", this.state);
      resolve();
    })
  );
}

export { hp, hf, wait, setStateAsync };
