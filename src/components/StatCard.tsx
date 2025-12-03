import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: React.ReactNode;
  delay?: number;
}

const StatCard = ({ icon: Icon, title, value, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-card rounded-xl p-6 shadow-card hover:shadow-glow transition-smooth border border-border"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center shadow-glow">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
