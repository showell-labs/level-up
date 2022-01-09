import React from "react";
import { ScrollView, TouchableHighlight } from "react-native";
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
    <ScrollView>
      {files.map((file, index) => (
        <FileCard
          key={file.path}
          path={file.path}
          index={index}
          onNavigate={onNavigate}
        />
      ))}
    </ScrollView>
  );
};

const FileCard = React.memo(
  ({
    path,
    index,
    onNavigate,
  }: {
    path: string;
    index: number;
    onNavigate(path: string): void;
  }) => {
    return (
      <TouchableHighlight
        style={{ left: 0, top: index * 100, width: 100, height: 100 }}
        onPress={() => {
          onNavigate(path);
        }}
      />
    );
  }
);

export default FolderView;
