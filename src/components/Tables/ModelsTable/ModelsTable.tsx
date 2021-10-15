import React from "react";
import { useTranslation } from "react-i18next";
import { Table } from "components";

const modelData = [
    {
        brand: "Audi",
        model: "A3"
    },
    {
        brand: "Audi",
        model: "A4"
    },
    {
        brand: "Audi",
        model: "A6"
    },
    {
        brand: "Volkswagen",
        model: "Golf 7"
    },

    {
        brand: "Volkswagen",
        model: "Passat B8"
    },
    {
        brand: "Volkswagen",
        model: "Arteon"
    }
];

const buttonLinkStyle =
    "text-right underline hover:text-orange-treePoppy lowercase";

export const ModelsTable = (): JSX.Element => {
    const { t } = useTranslation();
    // const [models, setModels] = useState<IDefaultProps[]>([]);

    // useEffect(() => {
    //     getCarModels().then(res => {
    //         const { carModels } = res.data;

    //         setModels([...carModels]);
    //     });
    // }, []);

    return (
        <Table
            className="mb-4"
            headings={[t("general.model"), t("general.brand"), "", ""]}
            rows={[
                ...modelData.map(model => [
                    model.model,
                    model.brand,
                    <div key={2} className="text-right">
                        <button className={buttonLinkStyle}>
                            {t("general.edit")}
                        </button>
                    </div>,
                    <div key={3} className="text-right">
                        <button className={buttonLinkStyle}>
                            {t("general.delete")}
                        </button>
                    </div>
                ])
            ]}
        />
    );
};
