import { Schema, model } from "mongoose";

const WorkspaceScheme = new Schema<any>(
  {
    slug: {
      type: String,
    },
    code:{
        type:String
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const WorkspaceModel = model("workspaces", WorkspaceScheme);
export default WorkspaceModel;
