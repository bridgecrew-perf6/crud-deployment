import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const App = () => {

  const [movieName, setMovieName] = useState("");
  const [movieReview, setMovieReview] = useState("");
  const [movieReviewList, setMovieReviewList] = useState([]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    Axios.get("https://mysql-deploy-react.herokuapp.com//api/get").then((res) => {
      setMovieReviewList(res.data);
    })
  }, [])

  const formSubmitHandler = e => {
    e.preventDefault();
    try {
      Axios.post("https://mysql-deploy-react.herokuapp.com//api/insert", {
        movieName: movieName, 
        movieReview: movieReview,
      }).then((res) => {
        setMovieReviewList(prev => {
          return [...prev, {
            id: uuidv4(),
            movieName,
            movieReview,
          }];
        })
      })
    }catch(err) {
      console.log(err);
    }
  }

  const deleteReview = (movie) => {
    try {
      Axios.delete(`https://mysql-deploy-react.herokuapp.com//api/delete/${movie}`);
      setMovieReviewList(prev => {
        const updatedReviewList = prev.filter(p => p.movieReview != movie);
        return updatedReviewList;
      })
    } catch (err) {
      console.log(err);
    }
  }

  const updateReview = (currReview) => {
    try {
      Axios.put("https://mysql-deploy-react.herokuapp.com//api/update", {
        currReview: currReview,
        newReview: newReview,
      });
      setMovieReviewList(prev => {
        let indexOfObj = prev.findIndex(r => r.movieReview == currReview);
        prev[indexOfObj] = {...prev[indexOfObj], movieReview: newReview};
        return [...prev];
      })
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      <h1>MOVIE REVIEW APP</h1>
      <form onSubmit={formSubmitHandler}>
        <label>Movie name:</label>
        <input type="text" onChange={e => {setMovieName(e.target.value)}} />
        <label>Movie review:</label>
        <input type="text" onChange={e => {setMovieReview(e.target.value)}} />
        <button type="submit">Submit</button>
      </form>
      <h1>Reviews</h1>
      <ul>
        {movieReviewList.map(r => {
          return <li key={r.id || uuidv4()}>
            <h2>{r.movieName}</h2>
            <span>{r.movieReview}</span>
            <div className="actions">
              <input type="text" onChange={(e) => {setNewReview(e.target.value)}} />
              <button onClick={() => {updateReview(r.movieReview)}} className='update-btn'>Update</button>
              <button onClick={() => {deleteReview(r.movieReview)}} className='delete-btn'>Delete</button>
            </div>
          </li>
        })}
      </ul>
    </React.Fragment>
  )
}

export default App