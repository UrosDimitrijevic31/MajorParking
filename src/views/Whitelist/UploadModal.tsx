import React, { useState } from "react";
import { Modal, Button, UploadFile, Checkbox } from "components";
import { useTranslation } from "react-i18next";

interface IUploadModalProps {
    visible: boolean;
    onClose: () => void;
}

export const UploadModal = ({
    onClose,
    visible
}: IUploadModalProps): JSX.Element => {
    const { t } = useTranslation();
    const [modalData, setModalData] = useState({
        override: false,
        deleteOldData: false,
        file: null
    });

    const handleModalDataChange = (prop, e): void => {
        const value = e.currentTarget ? e.currentTarget.value : e;

        setModalData({
            ...modalData,
            [prop]: value
        });
    };

    const handleUploadFileSubmit = (e): void => {
        e.preventDefault();
        // handleUploadModalToggle(false);
    };

    return (
        <Modal onClose={onClose} visible={visible}>
            <div className="whitelist__upload-file-content">
                <h3 className="font-light text-center text-blue-oxford text-2xl mb-4">
                    {t("whitelist.uploadFile")}
                </h3>
                <form onSubmit={handleUploadFileSubmit}>
                    <div className="flex flex-col items-start">
                        <div className="mb-4 inline-block">
                            <Checkbox
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "override",
                                    !modalData.override
                                )}
                                defaultChecked={modalData.override}
                                label={t("whitelist.overrideExistingData")}
                            />
                        </div>
                        <div className="mb-6 inline-block">
                            <Checkbox
                                onChange={handleModalDataChange.bind(
                                    this,
                                    "deleteOldData",
                                    !modalData.deleteOldData
                                )}
                                defaultChecked={modalData.deleteOldData}
                                label={t("whitelist.deleteOldData")}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <UploadFile
                            onFileSelect={handleModalDataChange.bind(
                                this,
                                "file"
                            )}
                        />
                    </div>
                    <div className="text-right">
                        <Button type="submit" color="success" className="mr-4">
                            {t("general.save")}
                        </Button>
                        <Button onClick={onClose} color="danger">
                            {t("general.cancel")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
