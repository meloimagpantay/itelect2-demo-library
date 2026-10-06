// Session 4: async data fetching, written two ways

const AUTHORS_URL = "https://jsonplaceholder.typicode.com/users";

const toAuthor = ({ id, name, email }) => ({ id, name, email });

// async / await version
export const fetchSampleAuthors = async () => {
  try {
    const res = await fetch(AUTHORS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const people = await res.json();
    return people.filter((person) => Boolean(person.email)).map(toAuthor);
  } catch (err) {
    console.error("fetchSampleAuthors failed:", err.message);
    return [];
  } finally {
    console.log("fetchSampleAuthors finished");
  }
};

// same result, written as a Promise chain instead
export const fetchSampleAuthorsPromise = () =>
  fetch(AUTHORS_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((people) => people.filter((p) => Boolean(p.email)).map(toAuthor))
    .catch((err) => {
      console.error("fetchSampleAuthorsPromise failed:", err.message);
      return [];
    });
