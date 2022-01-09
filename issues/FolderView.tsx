import React from "react";
import {
  ScrollView,
  StyleProp,
  TouchableHighlight,
  ViewStyle,
} from "react-native";
import ServiceFactory from "../src/ServiceFactory";

interface File {
  path: string;
}

interface NavigatorService {
  navigate(path: string): void;
}

const FolderView = ({ files }: { files: File[] }) => {
  const onNavigate = (path: string) => {
    ServiceFactory.createService<NavigatorService>("navigatorService").navigate(
      path
    );
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {files.map((file, index) => (
        <FileCard
          key={file.path}
          path={file.path}
          style={{ top: index * 100 }}
          onNavigate={onNavigate}
        />
      ))}
    </ScrollView>
  );
};

const FileCard = React.memo(
  ({
    path,
    style,
    onNavigate,
  }: {
    path: string;
    style: StyleProp<ViewStyle>;
    onNavigate(path: string): void;
  }) => {
    return (
      <TouchableHighlight
        style={[{ left: 0, width: 100, height: 100 }, style]}
        onPress={() => {
          onNavigate(path);
        }}
      />
    );
  }
);

export default FolderView;
