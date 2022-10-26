const getMovies = async(url) => {
  const data = await fetch(url)

  return data.json()
}

export { getMovies }