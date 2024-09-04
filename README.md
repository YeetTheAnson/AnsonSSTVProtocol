# AnsonSSTVProtocol
A custom sstv protocol i made, with a website that can encode and decode (currently broken)

![AnsonSSTVProtocol](https://github.com/YeetTheAnson/AnsonSSTVProtocol/raw/main/1.png)

https://github.com/user-attachments/assets/8096cb0a-f1f8-4a96-920f-04ccefba3899

Visit the site and try out the site yourself [AnsonSSTVProtocol](https://yeettheanson.github.io/AnsonSSTVProtocol/index.html)


> [!IMPORTANT]  
> This is WIP, but the project is shipped and somewhat playable


# Getting started

1. Launch the html site
    - [Hosted on GitHub pages](#how-to-visit-the-link)
    - [Run locally](#how-to-run-locally)
2. Learn how to use the encoder [here](#usage)
4. Learn about the features [here](#features)


## How to visit the link

1. Copy and paste the following link into your browser address bar and press the enter key `https://yeettheanson.github.io/AnsonSSTVProtocol/index.html`

## How to run locally

1. Type ```git clone https://github.com/YeetTheAnson/AnsonSSTVProtocol``` into CMD
2. Navigate to the correct folder with ```cd html```
3. Type ```start index.html```  into CMD
4. Your browser of choice should open with the webpage


# Usage

1. Press Encode SSTV
2. Drag an drop or upload image into the upload box
3. After selecting an image, press transmit
4. Decoding is currently broken


## Features
1. Encode SSTV

## Extras
This is how the protocol work

- Each tone is sent for 20ms
- The header sent is `011000010110111001110011011011110110111001110011011100110111010001110110`, which is just `ansonsstv` in binary where the lows are 400hz and highs are 700hz
- The payload is sent subpixel by subpixel, each subpixel color value is 0-255, which is mapped to 900hz to 1900hz.
- In between each pixels, it is seperated by 700hz for 20ms and 2200hz for 20ms
- In between each lines, it is seperated by `01101100011010010110111001100101` which is just `line` in binary where the lows are 400hz and the highs are 700hz
