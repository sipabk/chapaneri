import { useParams, Link } from "react-router-dom";
import {
  User, Calendar, MapPin, Mail, Phone, Home,
  Users, ArrowLeft, Heart, TreeDeciduous
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MemberCard } from "@/components/members/MemberCard";
import { LineagePath } from "@/components/members/LineagePath";
import { RelatedMembersSidebar } from "@/components/members/RelatedMembersSidebar";
import { Button } from "@/components/ui/button";
import {
  getMemberById, getParents, getChildren,
  getSiblings, getSpouse
} from "@/data/familyData";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const member = getMemberById(Number(id));

  if (!member) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24">
          <div className="container mx-auto px-4 py-24 text-center">
            <User className="w-24 h-24 mx-auto text-muted-foreground/50 mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Member Not Found
            </h1>
            <p className="text-muted-foreground mb-8">
              The family member you're looking for doesn't exist in our records.
            </p>
            <Link to="/members">
              <Button className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Members
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const spouse = getSpouse(member.id);
  const parents = getParents(member.id);
  const children = getChildren(member.id);
  const siblings = getSiblings(member.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Back Link */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/members"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>
        </div>

        {/* Profile Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className={cn(
                    "w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center shadow-heritage flex-shrink-0 ring-4 ring-background",
                    member.gender === 'male'
                      ? "bg-gradient-to-br from-primary to-primary/80"
                      : "bg-gradient-to-br from-accent to-accent/80"
                  )}
                >
                  <User className={cn(
                    "w-16 h-16 md:w-20 md:h-20",
                    member.gender === 'male' ? "text-primary-foreground" : "text-accent-foreground"
                  )} />
                </motion.div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground mb-3">
                    {member.relationship}
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {member.name}
                  </h1>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto md:mx-0">
                    {member.birthDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Born: {member.birthDate}</span>
                      </div>
                    )}
                    {member.birthPlace && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{member.birthPlace}</span>
                      </div>
                    )}
                    {member.deathDate && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Died: {member.deathDate}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <a href={`mailto:${member.email}`} className="text-sm hover:text-primary transition-colors">
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                    )}
                    {member.address && (
                      <div className="flex items-start gap-2 text-muted-foreground sm:col-span-2">
                        <Home className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{member.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content with Sidebar */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Lineage Path */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <LineagePath member={member} />
                </motion.div>

                {/* Spouse */}
                {spouse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-accent" />
                      Spouse
                    </h2>
                    <div className="max-w-xs">
                      <MemberCard member={spouse} />
                    </div>
                  </motion.div>
                )}

                {/* Parents */}
                {parents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <TreeDeciduous className="w-5 h-5 text-primary" />
                      Parents
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {parents.map(parent => (
                        <MemberCard key={parent.id} member={parent} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Siblings */}
                {siblings.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Siblings ({siblings.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {siblings.map(sibling => (
                        <MemberCard key={sibling.id} member={sibling} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Children */}
                {children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Children ({children.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {children.map(child => (
                        <MemberCard key={child.id} member={child} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 order-first lg:order-last">
                <div className="lg:sticky lg:top-24 space-y-6">
                  <RelatedMembersSidebar member={member} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MemberDetail;
