module.exports = {
  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    } catch (error) {
      console.error("Unable to fetch data:", error);
    }
  },
  fetchNames(nameType) {
    return fetchData(`https://www.randomlists.com/data/names-${nameType}.json`);
  },
  pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },
  async generateName() {
    try {
        let gender;
        const num = Math.floor((Math.random() * 1) + 1);
        if (num === 1) {
            gender = 'male'
        } else {
            gender = 'female'
        }

      // Fetch both name lists in parallel
      const response = await Promise.all([fetchNames(gender)]);

      // Promise.all returns an array of responses
      // to our two requests, so select them
      const [firstNames] = response;

      // Pick a random name from each list
      const firstName = pickRandom(firstNames.data);

      // Use a template literal to format the full name
      return `${firstName}`;
    } catch (error) {
      console.error("Unable to generate name:", error);
    }
  },
};
