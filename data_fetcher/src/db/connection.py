#
# Alberto MH 2021
#

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

import conf
from .models import Base


class DatabaseConnection:
    def __init__(self) -> None:
        # Instantiate structures needed to connect to the database, and create
        # tables if they don't yet exist.
        self.db: Engine = create_engine(conf.DB_PATH)

        # Create all tables defined in `models.py` if they do not already exist.
        Base.metadata.create_all(self.db)

        # Bind the engine to the Base class metadata so that declaratives can
        # be accessed via a DBSession instance.
        Base.metadata.bind = self.db
        DBSession = sessionmaker(bind=self.db)
        self.db_session: Session = DBSession()

    def get_db_session(self) -> Session:
        return self.db_session
