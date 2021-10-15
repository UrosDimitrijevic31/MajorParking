import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

export interface IUploadFileProps {
    onFileSelect: (src: string) => void;
}

export const UploadFile = ({ onFileSelect }: IUploadFileProps): JSX.Element => {
    const { t } = useTranslation();
    const [fileName, setFileName] = useState("");

    const handleFileSelect = (e): void => {
        // @NOTE limit to 10 letters
        const fileNameSliced =
            e.currentTarget.files[0].name.slice(0, 10) + "...";
        setFileName(fileNameSliced);
        onFileSelect(URL.createObjectURL(e.currentTarget.files[0]));
    };

    const removeFile = (e): void => {
        e.preventDefault();
        setFileName("");
        onFileSelect("");
    };

    return (
        <div className="upload-file">
            <div className="upload-file__content flex justify-between">
                <div className="upload-file__file-info border-blue-sanJuan border-b border-solid flex-1 flex justify-end items-center">
                    {fileName && (
                        <>
                            <span className="mr-4">{fileName}</span>
                            <button
                                className="upload-file__remove-btn"
                                onClick={removeFile}
                            >
                                <FontAwesomeIcon
                                    className="hover:text-blue-sanJuan"
                                    icon="times"
                                />
                            </button>
                        </>
                    )}
                </div>
                <label
                    htmlFor="file"
                    className="upload-file__upload-btn btn btn--primary py-2 px-6 ml-4 inline flex-0-auto"
                >
                    {t("general.upload")}
                </label>
            </div>
            <input
                name="file"
                id="file"
                type="file"
                onChange={handleFileSelect}
            />
        </div>
    );
};
