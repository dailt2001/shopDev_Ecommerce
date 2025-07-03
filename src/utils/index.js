import _ from "lodash";
import crypto from "crypto";
import { Types } from "mongoose"

export const convertToObjectIdMongodb = id => new Types.ObjectId(id)
export const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};
export const generateKeys = () => {
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    return { privateKey, publicKey };
};

export const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((sl) => [sl, 1]));
};

export const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((sl) => [sl, 0]));
};

// export const removeUndefinedObject = (obj) => {
//     Object.keys(obj).forEach((key) => {
//         if (obj[key] === null || undefined) {
//             delete obj[key];
//         }
//     });
//     return obj;
// };

export const updateNestedObjectParser = (obj) => {
    const final = {};
    Object.keys(obj).forEach((key) => {
        if (
            typeof obj[key] === "object" &&
            !Array.isArray(obj[key]) &&
            obj[key] !== null
        ){
            const response = updateNestedObjectParser(obj[key]);
            //             obj[key] = { internal: "128GB", external: "SD" }
            // ↓ đệ quy ↓
            // response = {
            //   "internal": "128GB",
            //   "external": "SD"
            // }

            Object.keys(response).forEach((k) => {
                final[`${key}.${k}`] = response[k];
            });
        }
        else if(obj[key] === null || undefined){
            delete obj[key]
        }
        else {
            final[key] = obj[key];
        }
    });

    return final;
};
