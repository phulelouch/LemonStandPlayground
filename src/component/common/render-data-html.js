import React from 'react';
import {Dimensions, View} from 'react-native';
//import IframeRenderer, {iframeModel} from '@native-html/iframe-plugin';
import RenderHTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import IframeRenderer, { useHtmlIframeProps, HTMLIframe, iframeModel } from '@native-html/iframe-plugin';


const renderers = {
  iframe: (props) => (
    <View renderToHardwareTextureAndroid={true} >
      <IframeRenderer {...props}  />
    </View>
  ),
};

const customHTMLElementModels = {
  iframe: iframeModel,
};

const removeH5PIframes = (html) => {
  // This regular expression matches <div> elements with class "h5p-iframe-wrapper" and their contents.
  const regex = /<div class="h5p-iframe-wrapper">.*?<\/div>/gs;
  return html.replace(regex, '');
};

const transformIframe = (html) => {
  // This regex matches iframes with their width, height, and id attributes, accommodating for 1 or 2 digit ids.
  const regex = /(<iframe [^>]*src="[^"]+id=)(\d{1,2})([^>]*width=")(\d+)("[^>]*height=")(\d+)("[^>]*>)/g;
  const windowWidth = Dimensions.get('window').width - 10;
  const windowHeight = Dimensions.get('window').height;
  const y = 10;  // or whatever value you'd like

  return html.replace(regex, (match, p1, id, p2, originalWidth, p4, originalHeight, p6) => {
    let newHeight;

    if (id === '3' || id === '8' || id === '10') {
      newHeight = (parseInt(originalWidth) * parseInt(originalHeight)) / windowWidth;
      // Condition to check if the new height exceeds windowHeight by y for ids `3`, `8`, and `10`.
      if (newHeight > windowHeight + y) {
        newHeight = windowHeight + y;
      }
    } else {
      newHeight = windowWidth;  // Setting the height to windowWidth
      if (newHeight + y > windowWidth) {
        newHeight = windowWidth - y;
      }
    }

    return `${p1}${id}${p2}${windowWidth}${p4}${newHeight}${p6}`;
  });
};


const RenderDataHTML = React.memo(function RenderDataHTML({html, style = {}}) {
  
  let processedHtml = html || '';
  processedHtml = removeH5PIframes(processedHtml);
  processedHtml = transformIframe(processedHtml);
  console.debug(processedHtml)
  return (
    <RenderHTML
      systemFonts={[
        'Poppins',
        'Poppins-ExtraLight',
        'Poppins-Light',
        'Poppins-Medium',
        'Poppins-SemiBold',
        'Poppins-Bold',
        'Poppins-ExtraBold',
      ]}
      source={{
        html: processedHtml || '',
      }}
      tagsStyles={{
        body: {
          fontFamily: 'Poppins-ExtraLight',
          fontSize: 13,
          color: '#000',
          fontWeight: '300',
          ...style,
        },
      }}
      enableExperimentalMarginCollapsing
      renderers={renderers}
      WebView={WebView}
      contentWidth={Dimensions.get('window').width - 32}
      customHTMLElementModels={customHTMLElementModels}
      renderersProps={{
        img: {
          enableExperimentalPercentWidth: true,
        },
      }}
    />
  );
});

export default RenderDataHTML;
