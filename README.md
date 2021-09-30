
# Alexa skill with IoT Integration using custom PHP API 
#### Built for my company Tesseract Lights (https://tesseract.rezzlon.com)

This API based Alexa Skill was used to authenticate and turn on IOT Lamps through the Internet. The Alexa skill based on AWS Lambda, makes two API calls. Alexa takes the input for the Lamp Code (Unique code given by us to the lamps) and build the API query and makes a POST request. The API returns a value which authenticates the Lamp. Once its authenticated, we store the lamp code in the Alexa Persistance S3 bucket with the Alexa UID.
The next API endpoint is called everytime the user initiates a color change using alexa. The lampcode stored in the S3 bucket is fetched and sent along with the HTTP post request.
## API Reference

#### Authenticate the Lampcode

```http
  POST endpoint/?lampcode=?,UID=?
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Lampcode` | `string` | **Required**. Your Lampcode|
| `UID` | `string` | **Required**. Alexa UID (automatic)|

#### Change the color

```http
  POST endpoint/?lampcode=?,color=?
```
If color is not mentioned in the API request, the next color in the list is automatically selected.
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Lampcode` | `string` | **Required**. Your Lampcode|
| `Color` | `string` | The color needed to be changed|

  
## Design Architecture

<img src="images/alexadiag.png" alt="Alexa SKill IOT integration Diagram" >


## Configurations of Alexa Developer Console

- Create an Invocation Name, that will trigger the Alexa skill. In our case it is " Virtual Tesseract"

<img src="images/invocation.png" alt="Alexa SKill IOT integration Diagram" >


  
