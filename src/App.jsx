// ============================================
// DOCUMENT SIMPLIFIÉ — App.jsx
// ============================================

import { useState, useRef } from "react"
import "./App.css"
import jsPDF from "jspdf"

const DOCUMENTS = [
  {
    id: "location", icon: "🏠", titre: "Contrat de location", desc: "Bail résidentiel",
    champs: [
      { label: "Nom complet du propriétaire (BAILLEUR)", placeholder: "Ex: Ahmed Benali" },
      { label: "Nom complet du locataire", placeholder: "Ex: Sara Idrissi" },
      { label: "Date de naissance du propriétaire", placeholder: "Ex: 15/03/1975" },
      { label: "Lieu de naissance du propriétaire", placeholder: "Ex: Casablanca" },
      { label: "Date de naissance du locataire", placeholder: "Ex: 22/07/1990" },
      { label: "Lieu de naissance du locataire", placeholder: "Ex: Rabat" },
      { label: "Adresse du propriétaire", placeholder: "Ex: 5 Rue Ibn Battouta, Casablanca" },
      { label: "Adresse du locataire", placeholder: "Ex: 12 Rue Hassan II, Kénitra" },
      { label: "Adresse du bien loué", placeholder: "Ex: 8 Av. Mohammed V, Agadir" },
      { label: "Loyer mensuel (DH)", placeholder: "Ex: 3500" },
      { label: "Durée du bail (en années)", placeholder: "Ex: 2" },
      { label: "Date de début du bail", placeholder: "Ex: 01/07/2026" },
      { label: "Date de fin du bail", placeholder: "Ex: 01/07/2028" },
      { label: "Dépôt de garantie (DH)", placeholder: "Ex: 7000" },
      { label: "Ville de signature", placeholder: "Ex: Casablanca" },
      { label: "Date de signature", placeholder: "Ex: 23/06/2026" },
      { label: "Nombre d'exemplaires", placeholder: "Ex: 2" },
    ],
  },
  {
    id: "travail", icon: "💼", titre: "Contrat de travail", desc: "CDI / CDD",
    champs: [
      { label: "Nom de l'employeur / société", placeholder: "Ex: Société XYZ SARL" },
      { label: "Nom complet de l'employé", placeholder: "Ex: Karim Alaoui" },
      { label: "Poste occupé", placeholder: "Ex: Développeur Web" },
      { label: "Salaire mensuel (DH)", placeholder: "Ex: 8000" },
      { label: "Type de contrat", placeholder: "Ex: CDI" },
      { label: "Date de début", placeholder: "Ex: 01/07/2026" },
      { label: "Ville de signature", placeholder: "Ex: Casablanca" },
      { label: "Date de signature", placeholder: "Ex: 23/06/2026" },
    ],
  },
  {
    id: "nda", icon: "🔒", titre: "NDA", desc: "Confidentialité",
    champs: [
      { label: "Partie A (nom ou société)", placeholder: "Ex: Entreprise Alpha SARL" },
      { label: "Partie B (nom ou société)", placeholder: "Ex: Entreprise Beta SA" },
      { label: "Objet confidentiel", placeholder: "Ex: Code source, données clients" },
      { label: "Durée de validité", placeholder: "Ex: 2 ans" },
      { label: "Lieu de signature", placeholder: "Ex: Casablanca" },
      { label: "Date de signature", placeholder: "Ex: 23/06/2026" },
    ],
  },
  {
    id: "demeure", icon: "⚠️", titre: "Mise en demeure", desc: "Lettre formelle",
    champs: [
      { label: "Nom complet de l'expéditeur", placeholder: "Ex: Mohamed Tahir" },
      { label: "Nom / société du destinataire", placeholder: "Ex: Société YYY" },
      { label: "Objet du litige", placeholder: "Ex: Loyers impayés" },
      { label: "Montant réclamé (DH)", placeholder: "Ex: 15000" },
      { label: "Délai de réponse", placeholder: "Ex: 8 jours" },
      { label: "Ville", placeholder: "Ex: Casablanca" },
      { label: "Date de la lettre", placeholder: "Ex: 23/06/2026" },
    ],
  },
  {
    id: "vente", icon: "🤝", titre: "Contrat de vente", desc: "Vente de bien",
    champs: [
      { label: "Nom complet du vendeur", placeholder: "Ex: Ali Berrada" },
      { label: "Nom complet de l'acheteur", placeholder: "Ex: Fatima Zahra" },
      { label: "Description du bien vendu", placeholder: "Ex: Voiture Dacia Logan 2020" },
      { label: "Prix de vente (DH)", placeholder: "Ex: 85000" },
      { label: "Mode de paiement", placeholder: "Ex: Virement bancaire" },
      { label: "Ville de signature", placeholder: "Ex: Casablanca" },
      { label: "Date de signature", placeholder: "Ex: 23/06/2026" },
    ],
  },
  {
    id: "prestation", icon: "🛠️", titre: "Prestation", desc: "Mission freelance",
    champs: [
      { label: "Nom du prestataire", placeholder: "Ex: Youssef Dev" },
      { label: "Nom du client", placeholder: "Ex: StartupMA" },
      { label: "Description de la mission", placeholder: "Ex: Développement site web e-commerce" },
      { label: "Tarif total (DH)", placeholder: "Ex: 20000" },
      { label: "Durée de la mission", placeholder: "Ex: 3 mois" },
      { label: "Ville de signature", placeholder: "Ex: Casablanca" },
      { label: "Date de signature", placeholder: "Ex: 23/06/2026" },
    ],
  },
]

export default function App() {
  const [mode, setMode]                     = useState("generer")
  const [docActif, setDocActif]             = useState(DOCUMENTS[0])
  const [valeurs, setValeurs]               = useState({})
  const [champsExtra, setChampsExtra]       = useState([])
  const [resultat, setResultat]             = useState("")
  const [loading, setLoading]               = useState(false)
  const [langue, setLangue]                 = useState("Français")
  const [copie, setCopie]                   = useState(false)
  const [fichier, setFichier]               = useState(null)
  const [fichierPreview, setFichierPreview] = useState(null)
  const [fichierBase64, setFichierBase64]   = useState(null)
  const [fichierType, setFichierType]       = useState(null)
  const [corrections, setCorrections]       = useState({})
  const [fichierTexte, setFichierTexte]     = useState("")
  const fileInputRef = useRef(null)

  const changerMode = (nouveauMode) => {
    setMode(nouveauMode)
    setResultat("")
    setValeurs({})
    setChampsExtra([])
    setCorrections({})
    supprimerFichier()
  }

  const changerDoc = (doc) => {
    setDocActif(doc)
    setValeurs({})
    setChampsExtra([])
    setCorrections({})
    setResultat("")
  }

  const handleChange = (label, valeur) => {
    setValeurs((prev) => ({ ...prev, [label]: valeur }))
  }

  const handleCorrection = (label, valeur) => {
    setCorrections((prev) => ({ ...prev, [label]: valeur }))
  }

  const ajouterChamp = () => setChampsExtra((prev) => [...prev, { label: "", valeur: "" }])
  const updateChampExtra = (i, key, val) =>
    setChampsExtra((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)))
  const supprimerChampExtra = (i) =>
    setChampsExtra((prev) => prev.filter((_, idx) => idx !== i))

  // --- Upload fichier ---
  const handleFichierUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const estImage = file.type.startsWith("image/")
    const estPDF   = file.type === "application/pdf"
    if (!estImage && !estPDF) return

    setFichier(file)
    setFichierType(estImage ? "image" : "pdf")
    if (estImage) setFichierPreview(URL.createObjectURL(file))
    else setFichierPreview(null)

    const reader = new FileReader()
    reader.onload = () => setFichierBase64(reader.result.split(",")[1])
    reader.readAsDataURL(file)
  }

  const supprimerFichier = () => {
    setFichier(null)
    setFichierPreview(null)
    setFichierBase64(null)
    setFichierType(null)
    setFichierTexte("")
    setCorrections({})
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // --- Télécharger en PDF (mode générer) ---
  const telechargerPDF = () => {
    const doc        = new jsPDF({ unit: "mm", format: "a4" })
    const pageWidth  = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin     = 20
    const maxWidth   = pageWidth - margin * 2
    let y            = margin

    const parser   = new DOMParser()
    const htmlDoc  = parser.parseFromString(resultat, "text/html")
    const elements = htmlDoc.body.children

    Array.from(elements).forEach((el) => {
      if (y > pageHeight - margin) { doc.addPage(); y = margin }
      const tag  = el.tagName.toLowerCase()
      const text = el.textContent.trim()
      if (!text) return

      if (tag === "h1") {
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.text(text, pageWidth / 2, y, { align: "center" })
        y += 10
      } else if (tag === "h2") {
        y += 4
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        const lines = doc.splitTextToSize(text, maxWidth)
        doc.text(lines, pageWidth / 2, y, { align: "center" })
        y += lines.length * 6 + 2
      } else if (tag === "hr") {
        y += 2
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageWidth - margin, y)
        y += 4
      } else {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        const lines = doc.splitTextToSize(text, maxWidth)
        lines.forEach((line) => {
          if (y > pageHeight - margin) { doc.addPage(); y = margin }
          doc.text(line, margin, y)
          y += 5.5
        })
        y += 2
      }
    })

    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(150)
      doc.text("Document généré automatiquement — Document Simplifié", margin, pageHeight - 8)
      doc.text(`Page ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" })
    }

    doc.save(`${docActif.titre.replace(/ /g, "_")}.pdf`)
  }

  // --- Fonction principale ---
  const generer = async () => {
    setLoading(true)
    setResultat("")

    try {
      // ---- MODE UPLOAD → Backend Python ----
      if (mode === "uploader" && fichier) {
        const infos = {
          ...corrections,
          ...Object.fromEntries(
            champsExtra
              .filter((c) => c.label.trim())
              .map((c) => [c.label, c.valeur])
          ),
        }

        const formData = new FormData()
        formData.append("fichier", fichier)
        formData.append("infos", JSON.stringify(infos))
        formData.append("openrouter_key", "")
        formData.append("groq_key", import.meta.env.VITE_GROQ_API_KEY || "")

        const response = await fetch("https://Marjorieyunxi-legaldoc-backend.hf.space/remplir-pdf", {
          method: "POST",
          body: formData,
        })
        
        if (!response.ok) {
          let message = await response.text()
          try { message = JSON.parse(message).detail || message } catch { /* texte brut */ }
          setResultat("❌ Erreur backend : " + message)
          setLoading(false)
          return
        }

        const contentType = response.headers.get("content-type") || ""
        const isDocx = contentType.includes("wordprocessingml")
        const blob = await response.blob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement("a")
        a.href     = url
        a.download = isDocx ? "document_rempli.docx" : "document_rempli.pdf"
        a.click()

        setResultat(isDocx
          ? "✅ Document Word téléchargé ! Ouvre-le avec Microsoft Word."
          : "✅ Document rempli téléchargé avec succès !"
        )
        setLoading(false)
        return
      }

      // ---- MODE GÉNÉRER → Groq API ----
      const infosStandard = docActif.champs
        .map((c) => `${c.label}: ${valeurs[c.label] || "Non renseigné"}`)
        .join("\n")

      const infosExtra = champsExtra
        .filter((c) => c.label.trim())
        .map((c) => `${c.label}: ${c.valeur || "Non renseigné"}`)
        .join("\n")

      const toutesLesInfos = [infosStandard, infosExtra].filter(Boolean).join("\n")

      const prompt = `Tu es un expert juridique marocain. Génère un ${docActif.titre} complet et professionnel en ${langue === "Arabe" ? "arabe" : "français"}.

Informations :
${toutesLesInfos}

Formate OBLIGATOIREMENT en HTML :
- <h1> titre principal centré
- <h2> chaque article numéroté centré
- <p> chaque paragraphe justifié
- <strong> noms, montants, dates importants
- <hr> entre les sections
- <br> dans les zones de signature

Génère UNIQUEMENT le HTML, sans balise html/head/body, sans explication.
${langue === "Arabe" ? "Rédige ENTIÈREMENT en arabe, sens lecture droite vers gauche." : "Rédige entièrement en français."}`

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 6000,
        }),
      })

      const data = await response.json()
      if (data.choices && data.choices[0]) {
        setResultat(data.choices[0].message.content)
      } else {
        setResultat("❌ Erreur : réponse inattendue de l'API")
      }

    } catch (err) {
      console.log("ERREUR:", err)
      setResultat("❌ Erreur : " + err.message)
    }

    setLoading(false)
  }

  // --- Traduire en arabe ---
  const traduireArabe = async () => {
    if (!resultat) return
    setLoading(true)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "user",
            content: `Traduis ce document HTML en arabe. Conserve exactement les balises HTML. Traduis UNIQUEMENT le texte. Génère UNIQUEMENT le HTML traduit, sans explication.\n\n${resultat}`
          }],
          max_tokens: 6000,
        }),
      })
      const data = await response.json()
      if (data.choices && data.choices[0]) {
        setResultat(data.choices[0].message.content)
        setLangue("Arabe")
      }
    } catch (err) {
      console.log("Erreur traduction:", err)
    }
    setLoading(false)
  }

  const copier = async () => {
    await navigator.clipboard.writeText(resultat)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <div className="app">

      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-icon">⚖️</span>
          <span className="logo-text">Document <strong>Simplifié</strong></span>
        </div>
        <div className="navbar-right">
          <button
            className="langue-btn"
            onClick={() => setLangue(langue === "Français" ? "Arabe" : "Français")}
          >
            <span>{langue === "Français" ? "🇫🇷" : "🇲🇦"}</span>
            <span>{langue}</span>
            <span className="langue-arrow">↕</span>
          </button>
        </div>
      </nav>

      <header className="hero">
        <h1 className="hero-title">
          Vos documents <span className="hero-accent">légaux</span><br />en quelques minutes
        </h1>
        <p className="hero-subtitle">
          Générez un nouveau contrat ou régénérez un ancien document
        </p>
        <div className="mode-switch">
          <button
            className={`mode-btn ${mode === "generer" ? "mode-btn--active" : ""}`}
            onClick={() => changerMode("generer")}
          >
            <span>✨</span> Générer avec l'IA
          </button>
          <button
            className={`mode-btn ${mode === "uploader" ? "mode-btn--active" : ""}`}
            onClick={() => changerMode("uploader")}
          >
            <span>📄</span> Uploader un document
          </button>
        </div>
      </header>

      {/* ===== MODE GÉNÉRER ===== */}
      {mode === "generer" && (
        <>
          <section className="doc-types">
            {DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                className={`doc-card ${docActif.id === doc.id ? "doc-card--active" : ""}`}
                onClick={() => changerDoc(doc)}
              >
                <span className="doc-card-icon">{doc.icon}</span>
                <span className="doc-card-titre">{doc.titre}</span>
                <span className="doc-card-desc">{doc.desc}</span>
                {docActif.id === doc.id && <span className="doc-card-dot" />}
              </button>
            ))}
          </section>

          <main className="main-grid">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">✏️</span>
                <div>
                  <h2 className="panel-title">Informations</h2>
                  <p className="panel-subtitle">{docActif.titre}</p>
                </div>
              </div>
              <div className="form-fields">
                {docActif.champs.map((champ) => (
                  <div key={champ.label} className="field">
                    <label className="field-label">{champ.label}</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder={champ.placeholder}
                      value={valeurs[champ.label] || ""}
                      onChange={(e) => handleChange(champ.label, e.target.value)}
                    />
                  </div>
                ))}
                {champsExtra.map((champ, index) => (
                  <div key={index} className="field field-extra">
                    <input
                      type="text"
                      className="field-input field-input-label"
                      placeholder="Nom du champ (ex: Ville)"
                      value={champ.label}
                      onChange={(e) => updateChampExtra(index, "label", e.target.value)}
                    />
                    <div className="field-extra-row">
                      <input
                        type="text"
                        className="field-input"
                        placeholder="Valeur"
                        value={champ.valeur}
                        onChange={(e) => updateChampExtra(index, "valeur", e.target.value)}
                      />
                      <button className="btn-remove-field" onClick={() => supprimerChampExtra(index)}>✕</button>
                    </div>
                  </div>
                ))}
                <button className="btn-add-field" onClick={ajouterChamp}>
                  <span>+</span> Ajouter un champ
                </button>
              </div>
              <button
                className={`btn-generate ${loading ? "btn-generate--loading" : ""}`}
                onClick={generer}
                disabled={loading}
              >
                {loading ? <><span className="spinner" /> Génération en cours...</> : <><span>✨</span> Générer avec l'IA</>}
              </button>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">📄</span>
                <div>
                  <h2 className="panel-title">Aperçu du document</h2>
                  {resultat && <p className="panel-status"><span className="status-dot" />Document généré</p>}
                </div>
              </div>
              <div className={`preview-box ${langue === "Arabe" ? "preview-rtl" : ""}`}>
                {!loading && !resultat && (
                  <div className="preview-empty">
                    <span className="preview-empty-icon">📝</span>
                    <p>Remplissez le formulaire et cliquez sur<br /><strong>"Générer avec l'IA"</strong></p>
                  </div>
                )}
                {loading && (
                  <div className="preview-loading">
                    <div className="loading-dots"><span /><span /><span /></div>
                    <p>L'IA rédige votre document...</p>
                  </div>
                )}
                {!loading && resultat && (
                  <div className="preview-text" dangerouslySetInnerHTML={{ __html: resultat }} />
                )}
              </div>
              {resultat && (
                <div className="preview-actions">
                  <button className="btn-action" onClick={copier}>{copie ? "✅ Copié !" : "📋 Copier"}</button>
                  <button className="btn-action" onClick={traduireArabe} disabled={loading}>🇲🇦 Traduire en arabe</button>
                  <button className="btn-action" onClick={telechargerPDF}>⬇️ Télécharger PDF</button>
                  <button className="btn-action btn-action--primary" onClick={generer}>🔄 Régénérer</button>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ===== MODE UPLOADER ===== */}
      {mode === "uploader" && (
        <>
          <section className="doc-types">
            {DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                className={`doc-card ${docActif.id === doc.id ? "doc-card--active" : ""}`}
                onClick={() => changerDoc(doc)}
              >
                <span className="doc-card-icon">{doc.icon}</span>
                <span className="doc-card-titre">{doc.titre}</span>
                <span className="doc-card-desc">{doc.desc}</span>
                {docActif.id === doc.id && <span className="doc-card-dot" />}
              </button>
            ))}
          </section>

          <main className="main-grid main-grid--upload">
            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">📤</span>
                <div>
                  <h2 className="panel-title">Uploader votre document</h2>
                  <p className="panel-subtitle">PDF uniquement</p>
                </div>
              </div>

              {!fichier ? (
                <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
                  <span className="upload-zone-icon">📂</span>
                  <p className="upload-zone-text">Cliquez pour choisir un fichier</p>
                  <p className="upload-zone-hint">PDF — Max 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFichierUpload}
                    style={{ display: "none" }}
                  />
                </div>
              ) : (
                <div className="upload-preview">
                  {fichierType === "pdf" && <div className="upload-pdf-icon">📄</div>}
                  <div className="upload-preview-info">
                    <div>
                      <span className="upload-success">✅ {fichier.name}</span>
                      <span className="upload-size">{(fichier.size / 1024).toFixed(0)} KB</span>
                    </div>
                    <button className="upload-remove" onClick={supprimerFichier}>✕ Supprimer</button>
                  </div>
                </div>
              )}
<div className="form-fields">
                <p className="field-label" style={{ color: "var(--accent-light)", marginBottom: "6px" }}>
                  ✏️ Informations à insérer dans le document
                </p>
                {docActif.champs.map((champ) => (
                  <div key={champ.label} className="field">
                    <label className="field-label">{champ.label}</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder={champ.placeholder}
                      value={corrections[champ.label] || ""}
                      onChange={(e) => handleCorrection(champ.label, e.target.value)}
                    />
                  </div>
                ))}
                {champsExtra.map((champ, index) => (
                  <div key={index} className="field field-extra">
                    <input
                      type="text"
                      className="field-input field-input-label"
                      placeholder="Nom du champ (ex: Ville)"
                      value={champ.label}
                      onChange={(e) => updateChampExtra(index, "label", e.target.value)}
                    />
                    <div className="field-extra-row">
                      <input
                        type="text"
                        className="field-input"
                        placeholder="Valeur"
                        value={champ.valeur}
                        onChange={(e) => updateChampExtra(index, "valeur", e.target.value)}
                      />
                      <button className="btn-remove-field" onClick={() => supprimerChampExtra(index)}>✕</button>
                    </div>
                  </div>
                ))}
                <button className="btn-add-field" onClick={ajouterChamp}>
                  <span>+</span> Ajouter un champ
                </button>
              </div>

              <button
                className={`btn-generate ${loading ? "btn-generate--loading" : ""}`}
                onClick={generer}
                disabled={loading || !fichier}
              >
                {loading
                  ? <><span className="spinner" /> Traitement en cours...</>
                  : <><span>🔍</span> Remplir le document</>
                }
              </button>
            </div>

            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">📄</span>
                <div>
                  <h2 className="panel-title">Résultat</h2>
                  {resultat && <p className="panel-status"><span className="status-dot" />Prêt</p>}
                </div>
              </div>
              <div className="preview-box">
                {!loading && !resultat && (
                  <div className="preview-empty">
                    <span className="preview-empty-icon">📂</span>
                    <p>Uploadez un PDF, remplissez les champs<br />et cliquez sur <strong>"Remplir le document"</strong></p>
                  </div>
                )}
                {loading && (
                  <div className="preview-loading">
                    <div className="loading-dots"><span /><span /><span /></div>
                    <p>Traitement du document en cours...</p>
                  </div>
                )}
                {!loading && resultat && (
                  <div className="preview-text" dangerouslySetInnerHTML={{ __html: resultat }} />
                )}
              </div>
            </div>
          </main>
        </>
      )}

      <footer className="footer">
        <p>Document Simplifié · ✦ Powered by yunxi_mg · Fait pour le Maroc 🇲🇦</p>
      </footer>
    </div>
  )
}