import re
import unicodedata

from sqlalchemy.orm import Session

from app.models.scenario import Scenario


DEFAULT_SCENARIO_CODE = "PRODUCAO"
DEFAULT_SCENARIO_NAME = "Produção"


class ScenarioService:
    @staticmethod
    def _normalize_code(value: str) -> str:
        normalized = unicodedata.normalize("NFKD", (value or "").strip().upper())
        ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
        sanitized = re.sub(r"[^A-Z0-9]+", "_", ascii_text).strip("_")
        return sanitized or DEFAULT_SCENARIO_CODE

    @staticmethod
    def resolve(db: Session, raw_value: str | None) -> Scenario:
        code = ScenarioService._normalize_code(raw_value or DEFAULT_SCENARIO_CODE)
        scenario = db.query(Scenario).filter(Scenario.code == code).first()
        if scenario:
            return scenario

        if code == DEFAULT_SCENARIO_CODE and not raw_value:
            name = DEFAULT_SCENARIO_NAME
        else:
            name = (raw_value or code).strip() or code
        scenario = Scenario(code=code, name=name, is_active=True)
        db.add(scenario)
        db.flush()
        return scenario
