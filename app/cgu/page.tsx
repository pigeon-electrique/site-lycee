"use client"

import { Navbar } from '@/components/navbar'
import { Card, CardContent } from "@/components/ui/card"

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Container */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-6 text-center">
          Conditions Générales d’Utilisation
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Dernière mise à jour : <strong>06 septembre 2025</strong>
        </p>

        {/* Card */}
        <Card className="shadow-xl border rounded-2xl">
          <CardContent className="px-10 py-12">
            <div className="space-y-10 leading-relaxed text-justify">
              <section>
                <h2 className="text-2xl font-bold mb-3">1. Objet</h2>
                <p>
                  Les présentes <strong>Conditions Générales d’Utilisation</strong> (ci-après « CGU ») 
                  définissent les modalités et conditions d’accès et d’utilisation du site 
                  <strong> Pâtisserie</strong>, édité par <em>[ Gaspard Evezard ]</em>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">2. Accès au site</h2>
                <p>
                  Le Site est <strong>accessible gratuitement</strong> à tout utilisateur disposant d’un accès Internet. 
                  Les frais liés à la connexion (abonnement, matériel, etc.) restent à la charge de l’utilisateur.
                </p>
                <p className="mt-3">
                  L’Éditeur met tout en œuvre pour garantir un accès continu, mais 
                  <strong> ne peut être tenu responsable </strong> d’interruptions liées à la maintenance, 
                  aux mises à jour ou à des problèmes techniques.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">3. Inscription et compte utilisateur</h2>
                <p>
                  Certaines fonctionnalités nécessitent la <strong>création d’un compte</strong>.  
                  L’utilisateur s’engage à fournir des informations exactes et à jour.  
                  Les identifiants de connexion sont personnels et <strong>strictement confidentiels</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">4. Services proposés</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Consultation de recettes de pâtisserie</li>
                  <li>Création et gestion d’un compte utilisateur</li>
                  <li>Sauvegarde et partage de recettes</li>
                  <li>Accès à des fonctionnalités communautaires</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">5. Propriété intellectuelle</h2>
                <p>
                  Tous les contenus publiés sur le Site (textes, images, recettes, code source, design, etc.) 
                  sont protégés par le droit de la propriété intellectuelle.  
                  <strong> Toute reproduction ou utilisation sans autorisation est interdite.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">6. Responsabilité</h2>
                <p>L’Éditeur ne peut être tenu responsable notamment :</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Des dommages résultant de l’utilisation du Site ;</li>
                  <li>De l’exactitude des informations publiées par les utilisateurs ;</li>
                  <li>Des liens externes accessibles depuis le Site.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">7. Données personnelles</h2>
                <p>
                  Le Site collecte et traite certaines données personnelles conformément à la 
                  <strong> Politique de Confidentialité</strong>.  
                  Conformément au RGPD, tout utilisateur dispose d’un droit d’accès, de rectification 
                  et de suppression de ses données.
                </p>
                <p className="mt-3">
                  Pour exercer ce droit : <em>[ evezard.gaspard@gmail.com ]</em>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">8. Résiliation</h2>
                <p>
                  L’utilisateur peut supprimer son compte à tout moment depuis son espace personnel 
                  ou en contactant l’Éditeur.  
                  En cas de non-respect des présentes CGU, l’Éditeur se réserve le droit de 
                  <strong> suspendre ou supprimer le compte</strong>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">9. Modification des CGU</h2>
                <p>
                  L’Éditeur peut modifier les présentes CGU à tout moment.  
                  La version en vigueur est toujours disponible sur le Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-3">10. Droit applicable</h2>
                <p>
                  Les présentes CGU sont régies par le <strong>droit français</strong>.  
                  En cas de litige et à défaut de solution amiable, les tribunaux compétents 
                  seront ceux du ressort de <em>[ Montpellier ]</em>.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
