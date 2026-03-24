import React, { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../api/client.js";
import { Container, Card, Button, Input, TextArea, Select, Alert } from "../../components/ui.jsx";
import { useI18n } from "../../i18n/I18nContext.jsx";

const VALID = ["internet", "furniture", "electricity", "water", "cleanliness_common"];

export default function StudentComplaint() {
  const { category } = useParams();
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const [internetType, setInternetType] = useState("wifi");
  const [furnitureItem, setFurnitureItem] = useState("");
  const [elecType, setElecType] = useState("switch");
  const [waterType, setWaterType] = useState("drinking");
  const [floorNumber, setFloorNumber] = useState("");
  const [cabinIssue, setCabinIssue] = useState("");

  const labelKey = useMemo(() => {
    const m = {
      internet: "internet",
      furniture: "furniture",
      electricity: "electricity",
      water: "water",
      cleanliness_common: "cleanliness",
    };
    return m[category] || "title";
  }, [category]);

  if (!VALID.includes(category)) {
    return <Navigate to="/student" replace />;
  }

  function buildDetails() {
    if (category === "internet") return { issueType: internetType };
    if (category === "furniture") return { item: furnitureItem };
    if (category === "electricity") return { issueType: elecType };
    if (category === "water") return { issueType: waterType };
    return { floorNumber, cabinIssue };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setBusy(true);
    try {
      let images = [];
      if (files.length) {
        const fd = new FormData();
        for (const f of files) fd.append("images", f);
        const { data } = await api.post("/api/complaints/upload-images", fd);
        images = data.urls || [];
      }
      await api.post("/api/complaints", {
        category,
        title,
        description,
        details: buildDetails(),
        images,
      });
      setOk(t("submittedOk"));
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (e2) {
      setErr(e2.response?.data?.message || t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">{t(labelKey)}</h1>
        <p className="mb-6 text-slate-600">{t("uploadImagesFirst")}</p>

        {err ? (
          <div className="mb-4">
            <Alert type="error">{err}</Alert>
          </div>
        ) : null}
        {ok ? (
          <div className="mb-4">
            <Alert type="success">{ok}</Alert>
          </div>
        ) : null}

        <Card>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Input label={t("title")} value={title} onChange={(e) => setTitle(e.target.value)} required />

            {category === "internet" ? (
              <Select label={t("issueType")} value={internetType} onChange={(e) => setInternetType(e.target.value)}>
                <option value="wifi">{t("wifi")}</option>
                <option value="ethernet">{t("ethernet")}</option>
                <option value="router">{t("router")}</option>
              </Select>
            ) : null}

            {category === "furniture" ? (
              <Input
                label={t("furnitureItem")}
                value={furnitureItem}
                onChange={(e) => setFurnitureItem(e.target.value)}
                required
              />
            ) : null}

            {category === "electricity" ? (
              <Select label={t("issueType")} value={elecType} onChange={(e) => setElecType(e.target.value)}>
                <option value="switch">{t("switchIssue")}</option>
                <option value="fan_light">{t("fanLight")}</option>
                <option value="plug">{t("plug")}</option>
              </Select>
            ) : null}

            {category === "water" ? (
              <Select label={t("issueType")} value={waterType} onChange={(e) => setWaterType(e.target.value)}>
                <option value="drinking">{t("drinkingWater")}</option>
                <option value="cooler">{t("cooler")}</option>
                <option value="availability">{t("availability")}</option>
              </Select>
            ) : null}

            {category === "cleanliness_common" ? (
              <>
                <Input
                  label={t("floorNumber")}
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  required
                />
                <TextArea
                  label={t("cabinIssue")}
                  value={cabinIssue}
                  onChange={(e) => setCabinIssue(e.target.value)}
                  required
                />
              </>
            ) : null}

            <TextArea
              label={t("description")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="block">
              <div className="mb-2 text-base font-medium text-slate-700">{t("images")}</div>
              <input
                className="text-lg"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={busy}>
              {busy ? t("loading") : t("submit")}
            </Button>
          </form>
        </Card>
      </div>
    </Container>
  );
}
