import './App.css';
import Video from './components/Video';
import styled from "styled-components";

function App() {

  return (
    <StContainer>
      <Video />
    </StContainer>
  );
}

export default App;

const StContainer = styled.div`
  /* width:100%;
  height:100%;
  overflow:hidden auto;
  box-sizing:border-box;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  } */
  /* @media screen and (min-width: 768px) {
    width:600px;
  } */
  
`

