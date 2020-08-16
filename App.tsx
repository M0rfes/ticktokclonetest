/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';
import Video from 'react-native-video';
const {height, width} = Dimensions.get('window');
type video = {
  playbackUrl: string;
};

const App = () => {
  const [dataProvider, setDataProvider] = useState<DataProvider>(
    new DataProvider(
      (r1: video, r2: video) => r1.playbackUrl !== r2.playbackUrl,
    ),
  );
  const [page, setPage] = useState(0);
  const layout = new LayoutProvider(
    (i) => dataProvider.getDataForIndex(i),
    (type, dim) => {
      dim.height = height;
      dim.width = width;
    },
  );
  const getData = async () => {
    console.log(page);
    const data = await fetch(
      'https://europe-west1-boom-dev-7ad08.cloudfunctions.net/videoFeed',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({page}),
      },
    ).then((res) => res.json());

    setPage(page + 1);
    setDataProvider((dp) => dp.cloneWithRows([...dp.getAllData(), ...data]));
  };
  useEffect(() => {
    getData();
    return () => {};
  }, []);
  return (
    <View style={styles.videoBox}>
      {/* {videos.length > 0 ? (
        <Video
          source={{uri: videos[1].playbackUrl}} // Can be a URL or a local file.
          // // Store reference
          ref={player}
          style={styles.video}
          // Callback when video cannot be loaded
          // fullscreen={true}
          resizeMode="stretch"
          repeat
        />
      ) : (
        <Text style={styles.video}>Lodging</Text>
      )} */}
      {dataProvider.getAllData().length > 0 && (
        <RecyclerListView
          style={styles.videList}
          rowRenderer={(type, data: video) => {
            return (
              <Video
                source={{uri: data.playbackUrl}}
                style={styles.video}
                repeat
                resizeMode="stretch"
              />
            );
          }}
          dataProvider={dataProvider}
          layoutProvider={layout}
          // renderAheadOffset={height}
          onEndReached={() => {
            console.log('end', page);
            getData();
          }}
          //     scrollViewProps={
          //       {
          //         refreshControl: (
          // <RefreshControl
          //   refreshing={loading}
          //   onRefresh={async () => {
          //     setState({ loading: true });
          //     analytics.logEvent('Event_Stagg_pull_to_refresh');
          //     await refetchQueue();
          //     setState({ loading: false });
          //   }}
        />
      )}
    </View>
  );
};

var styles = StyleSheet.create({
  videoBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  videList: {
    flex: 1,
    width,
    height,
  },
});

export default App;
