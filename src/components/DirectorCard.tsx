import { motion } from "framer-motion";

interface DirectorCardProps {
  name: string;
  role: string;
  imageUrl: string;
  delay?: number;
}

const DirectorCard = ({ name, role, imageUrl, delay = 0 }: DirectorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="text-center"
    >
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary shadow-glow">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </motion.div>
  );
};

export default DirectorCard;
