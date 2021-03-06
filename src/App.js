import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
		"number":{
			"value":100,"density":{
				"enable":true,"value_area":800
			}
		},
		"color":{
			"value":"#fff"
		},
		"shape":{
			"type":"circle","stroke":{
				"width":0,"color":"#000000"
			}
		},
		"opacity":{
			"value":0.5,"random":true,"anim":{
				"enable":false,"speed":1,"opacity_min":0.1,"sync":false
			}
		},
		"size":{
			"value":10,"random":true,"anim":{
				"enable":false,"speed":40,"size_min":0.1,"sync":false
			}
		},
		"line_linked":{
			"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2
		},
		"move":{
			"enable":true,"speed":3,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{
				"enable":false,"rotateX":600,"rotateY":1200
			}
		}
	},
	"interactivity":{
		"detect_on":"canvas","events":{
			"onhover":{
				"enable":false,"mode":"bubble"
			},
			"onclick":{
				"enable":true,"mode":"repulse"
			},
			"resize":true
		},
		"modes":{
			"grab":{
				"distance":400,"line_linked":{
					"opacity":0.5
				}
			},
			"bubble":{
				"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3
			},
			"repulse":{
				"distance":200,"duration":0.4},
			"push":{
				"particles_nb":4
			},
			"remove":{
				"particles_nb":2
			}
		}
/*
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
*/
  }
};

const app = new Clarifai.App({
  apiKey: '686342e2e2b7476ab9911fb303ac5bdd'
 });
 
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      inputURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({inputURL: this.state.input});
    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if(route === 'signin') {
      this.setState({isSignedIn: false})
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
  
  render() {
    const {isSignedIn, box, inputURL, route} = this.state;
    return (
      <div>
        <Particles className='particles'
          params={particlesOptions}
        />
        <div className="App">
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
          { route === 'home'
          ? <div> 
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} inputURL={inputURL}/>
          </div>
          : (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }
        </div>
      </div>
    );
  }
}

export default App;
