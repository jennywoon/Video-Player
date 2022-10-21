import './App.css';
import Video from './components/Video';
import styled from "styled-components";
import { useMediaQuery } from "react-responsive"

function App() {

  return (
    <StContainer>
      <Video />
    </StContainer>
  );
}

export default App;

const StContainer = styled.div`
  /* width: 100%; */
  @media screen and (max-width: 1024px) {
    /* width:600px; */
  }
  
`

