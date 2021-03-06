import { Photo } from "../types/foto";
import { storage } from "../libs/firebase";
import { ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 as createID } from "uuid";

export const GetAll = async () => {
  let list: Photo[] = [];

  const galleryFolder = ref(storage, "galleryFolder");
  const photoList = await listAll(galleryFolder);

  for (let i in photoList.items) {
    let photoUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photoUrl,
    });
  }

  return list;
};

export const Insert = async (file: File) => {
  if (["/image/jpeg", "/image/jpg", "/image/png"].includes(file.type)) {
    let randomName = createID();
    let newFile = ref(storage, `galleryFolder/${randomName}`);
    let upload = await uploadBytes(newFile, file);
    let photoUrl = await getDownloadURL(upload.ref);

    return {
      name: upload.ref.name,
      url: photoUrl,
    } as Photo;
  } else {
    return new Error("Tipo de arquivo não permitido");
  }
};
