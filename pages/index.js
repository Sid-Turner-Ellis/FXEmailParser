import {useState, useRef, useEffect} from 'react'
import styled from 'styled-components'
import fileDownloadName from '../functions/fileDownloadName'
import testFileType from '../functions/testFileType'

export default function Home() {
  const [downloadLink, setDownloadLink] = useState('')
  const [email, setEmail] = useState('')
  const aTag = useRef(null)
  console.log('rerendered');
  const [canDrop, setCanDrop] = useState(false)

  useEffect(()=>{
    window.addEventListener('fileReady', startDownload)

    // return () => {
    //   window.removeEventListener('fileReady',startDownload)
    // }
  },[])

  return (
    <Body canDrop={canDrop}>
      <TopBar />
      <InnerWrap>
      <StepsComponent/>
        <div>
        <a ref={aTag} href={downloadLink} download={`${fileDownloadName()}.html`}></a>
        <FileUploadComponent setCanDrop={setCanDrop}  canDrop={canDrop}  setEmail={setEmail} />
        </div>
      </InnerWrap>
    </Body>
  )

  function startDownload(){
    console.log('starting download');
    const emailBlob = new Blob([email])
    setDownloadLink(prev => window.URL.createObjectURL(emailBlob))

    aTag.current.click()
  }
 
}


function FileUploadComponent({fileRef, setEmail, setCanDrop, canDrop}){

  return (
    <FileDropSpot canDrop={canDrop} onDragOver={(e)=>{
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      console.log('its in');

      if(!canDrop){
        setCanDrop(true)
      }

    }} onDragLeave={()=>{
      if(canDrop){
        setCanDrop(false)
      }
    }} onDrop={(e)=>{
      e.preventDefault()
      if(canDrop){
        setCanDrop(false)
      }
      const file = e.dataTransfer.files
      const type = file[0]

      if(testFileType(file[0])){
        const fr = new FileReader()
        fr.onload = readFile
        if(file[0]){
          if(file[0].type == 'text/html'){
            fr.readAsText(file[0])
          }
        }
      }
    }}>
      <UploadImage src="/outer.png"/>
      <Input type="file" accept=".html" />
    </FileDropSpot>
  )

  function readFile(file){
    const emailText = file.target.result

    // this mc edit will remove any edit tags from the images
    const regex = /mc:[^r"]+"[^"]+"/g
    const parsedHtml = emailText.replace(regex, '')
    setEmail(prev => parsedHtml)
    
    const fileReadyEvent = new CustomEvent("fileReady",{
      detail:{}
    })

    window.dispatchEvent(fileReadyEvent)
  
  }

}

const UploadImage = styled.img`
  width: 100%;
`;

const Input = styled.input`
  visibility:hidden;
`;

const InnerWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 10vh 0;
  width: 80%;
  margin: auto;
  align-items: center;
`;


const FileDropSpot = styled.div`
  margin: auto;
  width: 30vw;
  height: 60vh;
  /* background-color: ${props => props.canDrop ? 'rgba(66, 209, 137, 0.2)' : ''}; */


 
`;



const Body = styled.div`
  padding: 40px;
  background-color: ${props => props.canDrop ? 'rgba(66, 209, 137, 0.2)' : ''};


`;
const Steps = styled.div`
  color: #070532;

`;




const StepsTitle = styled.h2`
  text-decoration: underline;
  font-size: 2.5rem;
  margin-bottom: 30px;
`
const StepsList = styled.ol`
  list-style-position: inside;
`

const StepsListItem = styled.li`
  /* color: #9C9BAD; */
  font-size: 1.2rem;
  margin-bottom: 20px;
  width: 80%;

`

const StepsTitleContainer = styled.div`
  position: relative;

`;

const StepsImage = styled.img`
  position: absolute;
  top: -30px;
  left: -50px;
  z-index: -9999;
  width: 100px;
`;


function StepsComponent(){
  return (
    <Steps>
      <StepsTitleContainer>
        <StepsImage src="/FXelements.png" />
        <StepsTitle>Steps:</StepsTitle>
      </StepsTitleContainer>
    <StepsList>
      <StepsListItem> After creating the email in mailchimp, Export and download it to your computer</StepsListItem>
      <StepsListItem> Upload it here and once the parsing has completed, The download will automatically start</StepsListItem>
      <StepsListItem> Place the file back into the mailchimp editor in the create new </StepsListItem>
   </StepsList>
  </Steps>
  )
}




function TopBar(){
  return(
    <TBWrapper>
      <img src="/FXLogo.png" />
      <SubTitle>Email parser</SubTitle>
    </TBWrapper>
  )
}

const TBWrapper = styled.div`
  display: inline-block;

`;

const SubTitle = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-style: italic;
  color: #4D4D4D;
`;