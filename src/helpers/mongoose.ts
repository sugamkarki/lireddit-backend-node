import mongoose from "mongoose";
export default () => {
  mongoose
    .connect(
      "mongodb://user1:user123@localhost:27017/lireddit?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
    )
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
};
